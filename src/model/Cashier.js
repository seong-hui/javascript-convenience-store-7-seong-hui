import OrderItem from './OrderItem.js';
import Orders from './Orders.js';
import StockManager from './StockManager.js';
import Validator from '../validator/Validator.js';
import generateNowDateTime from '../utils/generateNowDateTime.js';
import STORE_MESSAGES from '../constants/storeMessages.js';

class Cashier {
  #boxesInventory;

  #orders;

  #promotionProductBox;

  #productBox;

  constructor(boxesInventory) {
    this.#boxesInventory = boxesInventory;
    this.#orders = new Orders();
  }

  async handleOrders(shoppingCart, readUserConfirmation) {
    const items = shoppingCart.getItems();
    for (let i = 0; i < items.length; i += 1) {
      const { product, quantity } = items[i];
      await this.#processCartItemToOrder(product, quantity, readUserConfirmation);
    }
    return this.#orders;
  }

  async #processCartItemToOrder(product, quantity, readUserConfirmation) {
    const allProductBox = StockManager.findProductBoxbyName(product.getName(), this.#boxesInventory);
    this.#productBox = allProductBox.productBox;
    this.#promotionProductBox = allProductBox.promotionProductBox;
    if (!this.#promotionProductBox) return this.#addRegularOrderItem(product, quantity);
    const totalPromotionStock = StockManager.calculateTotalStock(this.#promotionProductBox);
    await this.#checkPromotionAndOrder(product, quantity, totalPromotionStock, readUserConfirmation);
    return true;
  }

  async #checkPromotionAndOrder(product, quantity, totalPromotionStock, readUserConfirmation) {
    const remainQuantity = await this.#checkPromotion(
      totalPromotionStock,
      generateNowDateTime(),
      product,
      quantity,
      readUserConfirmation,
    );
    if (remainQuantity > 0) this.#addRegularOrderItem(product, remainQuantity);
  }

  async #checkPromotion(totalStock, nowDateTime, product, quantity, readUserConfirmation) {
    if (!this.#promotionProductBox.isActivePromotion(nowDateTime) || !this.#promotionProductBox.getQuantity())
      return quantity;
    const additionalQuantity = this.#promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Validator.checkEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      await this.#handleEnoughStock(product, quantity, additionalQuantity, readUserConfirmation);
      return 0;
    }
    return await this.#handleNotEnoughStock(product, quantity, totalStock, readUserConfirmation);
  }

  async #handleEnoughStock(product, quantity, additionalQuantity, readUserConfirmation) {
    if (additionalQuantity > 0) {
      const message = STORE_MESSAGES.ASK_ADDITIONAL_QUANTITY(product.getName(), additionalQuantity);
      const agreeValue = await readUserConfirmation(message);
      this.#addPromotionalOrderItem(product, quantity + agreeValue);
      return;
    }
    this.#addPromotionalOrderItem(product, quantity);
  }

  async #handleNotEnoughStock(product, quantity, totalStock, readUserConfirmation) {
    const unappliedQuantity = this.#promotionProductBox.calculateUnappliedQuantity(totalStock, quantity);
    if (unappliedQuantity > 0) {
      return await this.#processUnappliedLogic(unappliedQuantity, product, totalStock, quantity, readUserConfirmation);
    }
    return quantity;
  }

  async #processUnappliedLogic(unappliedQuantity, product, totalStock, quantity, readUserConfirmation) {
    const message = STORE_MESSAGES.ASK_UNAPPLIED_QUANTITY(product.getName(), unappliedQuantity);
    const agreeValue = await readUserConfirmation(message);
    if (agreeValue) {
      this.#addPromotionalOrderItem(product, totalStock);
      return quantity - totalStock;
    }
    this.#addPromotionalOrderItem(product, quantity - unappliedQuantity);
    return 0;
  }

  #addPromotionalOrderItem(product, quantity) {
    const promotionItemsQuantity = this.#promotionProductBox.calculatePromotionItemsQuantity(quantity);
    const orderItemQuantity = quantity - promotionItemsQuantity;
    const orderItem = new OrderItem(product, true, orderItemQuantity, promotionItemsQuantity);
    this.#orders.addOrderItem(orderItem);
    this.#promotionProductBox.reduceQuantity(quantity);
  }

  #addRegularOrderItem(product, orderItemQuantity) {
    const orderItem = new OrderItem(product, false, orderItemQuantity);
    this.#orders.addOrderItem(orderItem);
    this.#productBox.reduceQuantity(orderItemQuantity);
  }
}
export default Cashier;
