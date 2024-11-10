import { DateTimes } from '@woowacourse/mission-utils';
import InputView from '../view/InputView.js';
import OrderItem from './OrderItem.js';
import Orders from './Orders.js';
import StockManager from './StockManager.js';

class Cashier {
  #boxesInventory;

  #orders;

  constructor(boxesInventory) {
    this.#boxesInventory = boxesInventory;
    this.#orders = new Orders();
  }

  async handleOrders(shoppingCart) {
    const items = shoppingCart.getItems();
    for (let i = 0; i < items.length; i += 1) {
      const { product, quantity } = items[i];
      await this.#processCartItemToOrder(items[i]);
    }
    return this.#orders;
  }

  async #processCartItemToOrder(item) {
    const { productBox, promotionProductBox } = StockManager.findProductBoxbyName(
      item.product.getName(),
      this.#boxesInventory,
    );
    if (!promotionProductBox) {
      this.#addRegularOrderItem(item.product, item.quantity, productBox);
      return;
    }
    const totalPromotionStock = StockManager.calculateTotalStock(promotionProductBox);
    await this.#checkPromotionAndOrder(item, productBox, promotionProductBox, totalPromotionStock);
  }

  async #checkPromotionAndOrder(item, productBox, promotionProductBox, totalPromotionStock) {
    const remainQuantity = await this.checkPromotion(
      promotionProductBox,
      totalPromotionStock,
      DateTimes.now(),
      item.product,
      item.quantity,
    );
    if (remainQuantity > 0) this.#addRegularOrderItem(item.product, remainQuantity, productBox);
  }

  async checkPromotion(promotionProductBox, totalStock, nowDateTime, product, quantity) {
    if (!promotionProductBox.isActivePromotion(nowDateTime) || !promotionProductBox.getQuantity()) return quantity;
    const additionalQuantity = promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Cashier.#isEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      await this.#handleEnoughStock(product, quantity, additionalQuantity, promotionProductBox);
      return 0;
    }
    const remainQuantity = await this.#handleNotEnoughStock(product, quantity, totalStock, promotionProductBox);
    return remainQuantity;
  }

  async #handleEnoughStock(product, quantity, additionalQuantity, promotionBox) {
    if (additionalQuantity > 0) {
      const agreeValue = await Cashier.#readAdditionalAnswer(additionalQuantity, product.getName());
      this.#addPromotionalOrderItem(product, quantity + agreeValue, promotionBox);
      return;
    }
    this.#addPromotionalOrderItem(product, quantity, promotionBox);
  }

  async #handleNotEnoughStock(product, quantity, totalStock, promotionBox) {
    const unappliedQuantity = promotionBox.calculateUnappliedQuantity(totalStock, quantity);
    if (unappliedQuantity > 0) {
      const remains = await this.#processUnappliedLogic(unappliedQuantity, product, totalStock, promotionBox, quantity);
      return remains;
    }
    return quantity;
  }

  async #processUnappliedLogic(unappliedQuantity, product, totalStock, promotionBox, quantity) {
    const agreeValue = await Cashier.#readUserAnswer(unappliedQuantity, product.getName());
    if (agreeValue) {
      this.#addPromotionalOrderItem(product, totalStock, promotionBox);
      return quantity - totalStock;
    }
    this.#addPromotionalOrderItem(product, quantity - unappliedQuantity, promotionBox);
    return 0;
  }

  static #isEnoughStockForPromotion(totalPromotionStock, quantity, additionalQuantity) {
    return totalPromotionStock >= quantity + additionalQuantity;
  }

  static async #readAdditionalAnswer(additionalQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `\n현재 ${name}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
    if (answer === 'Y') return 1;
    return 0;
  }

  static async #readUserAnswer(unappliedQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `\n현재 ${name} ${unappliedQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
    if (answer === 'Y') return 1;
    return 0;
  }

  #addPromotionalOrderItem(product, quantity, promotionProductBox) {
    const promotionItemsQuantity = promotionProductBox.calculatePromotionItemsQuantity(quantity);
    const orderItemQuantity = quantity - promotionItemsQuantity;
    const orderItem = new OrderItem(product, true, orderItemQuantity, promotionItemsQuantity);
    this.#orders.addOrderItem(orderItem);
    promotionProductBox.reduceQuantity(quantity);
    // console.log(`프로모션 재고 구매 : 주문 개수 - ${orderItemQuantity}, 증정 개수 - ${promotionItemsQuantity}`);
  }

  #addRegularOrderItem(product, orderItemQuantity, productBox) {
    const orderItem = new OrderItem(product, false, orderItemQuantity);
    this.#orders.addOrderItem(orderItem);
    productBox.reduceQuantity(orderItemQuantity);
    // console.log(`일반 재고 구매 :  주문개수 - ${orderItemQuantity}`);
  }
}
export default Cashier;
