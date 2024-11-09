import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InputView from '../view/InputView.js';
import OrderItem from './OrderItem.js';
import Orders from './Orders.js';

class Cashier {
  #allProductBoxes;

  #orders;

  constructor(allProductBoxes) {
    this.#allProductBoxes = allProductBoxes;
    this.#orders = new Orders();
  }

  async handleOrders(shoppingCart) {
    const items = shoppingCart.getItems();
    for (let i = 0; i < items.length; i += 1) {
      await this.#processCartItemToOrder(items[i]);
    }
  }

  async #processCartItemToOrder(item) {
    const { productBox, promotionProductBox } = this.#findProductBoxbyName(item.product.getName());
    const totalPromotionStock = Cashier.#calculateTotalPromotionStock(promotionProductBox);
    if (!promotionProductBox) {
      this.#addRegularOrderItem(item.product, item.quantity, productBox);
      return;
    }
    await this.#checkPromotionAndOrder(item, productBox, promotionProductBox, totalPromotionStock);
  }

  #findProductBoxbyName(productName) {
    const matchingBoxes = this.#allProductBoxes.filter((box) => {
      return box.getProductName() === productName;
    });
    const productBox = matchingBoxes.find((box) => box instanceof ProductBox);
    const promotionProductBox = matchingBoxes.find((box) => box instanceof PromotionProductBox);
    return { productBox, promotionProductBox };
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
    if (!promotionProductBox.isActivePromotion(nowDateTime)) return quantity;
    const additionalQuantity = promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Cashier.#isEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      const remainQuantity = await this.#handleEnoughStock(product, quantity, additionalQuantity, promotionProductBox);
      return remainQuantity;
    }
    const remainQuantity = await this.#handleNotEnoughStock(product, quantity, totalStock, promotionProductBox);
    return remainQuantity;
  }

  async #handleEnoughStock(product, quantity, additionalQuantity, promotionBox) {
    if (additionalQuantity > 0) {
      const agreeValue = await Cashier.#readAdditionalAnswer(additionalQuantity, product.getName());
      this.#addPromotionalOrderItem(product, quantity + agreeValue, promotionBox);
      return 0;
    }
    return quantity;
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

  static #calculateTotalPromotionStock(promotionProductBox) {
    let totalStock = 0;
    if (promotionProductBox) totalStock += promotionProductBox.getQuantity();
    return totalStock;
  }

  static #isEnoughStockForPromotion(totalStock, quantity, additionalQuantity) {
    return totalStock >= quantity + additionalQuantity;
  }

  static async #readAdditionalAnswer(additionalQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `현재 ${name}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
    if (answer === 'Y') return 1;
    return 0;
  }

  static async #readUserAnswer(unappliedQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `현재 ${name} ${unappliedQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
    if (answer === 'Y') return 1;
    return 0;
  }

  #addPromotionalOrderItem(product, quantity, promotionProductBox) {
    const promotionItemsQuantity = promotionProductBox.calculatePromotionItemsQuantity(quantity);
    const orderItemQuantity = quantity - promotionItemsQuantity;
    const orderItem = new OrderItem(product, orderItemQuantity, promotionItemsQuantity);
    this.#orders.addOrderItem(orderItem);
    promotionProductBox.reduceQuantity(quantity);
    // console.log(`프로모션 재고 구매 : 주문 개수 - ${orderItemQuantity}, 증정 개수 - ${promotionItemsQuantity}`);
  }

  #addRegularOrderItem(product, orderItemQuantity, productBox) {
    const orderItem = new OrderItem(product, orderItemQuantity);
    this.#orders.addOrderItem(orderItem);
    productBox.reduceQuantity(orderItemQuantity);
    // console.log(`일반 재고 구매 :  주문개수 - ${orderItemQuantity}`);
  }
}
export default Cashier;
