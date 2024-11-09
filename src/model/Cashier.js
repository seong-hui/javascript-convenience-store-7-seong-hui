import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InputView from '../view/InputView.js';
import OrderItem from './OrderItem.js';

class Cashier {
  #shoppingCart;

  #allProductBoxes;

  constructor(shoppingCart, allProductBoxes) {
    this.#shoppingCart = shoppingCart;
    this.#allProductBoxes = allProductBoxes;
  }

  #findProductBoxbyName(productName) {
    const matchingBoxes = this.#allProductBoxes.filter((box) => {
      return box.getProductName() === productName;
    });

    const productBox = matchingBoxes.find((box) => box instanceof ProductBox);
    const promotionProductBox = matchingBoxes.find((box) => box instanceof PromotionProductBox);
    return { productBox, promotionProductBox };
  }

  async findValidBoxesForCartItems(shoppingCart) {
    const items = shoppingCart.getItems();
    for (let i = 0; i < items.length; i += 1) {
      const { name } = items[i];
      const { productBox, promotionProductBox } = this.#findProductBoxbyName(name);
      const totalStock = Cashier.#calculateTotalStock(promotionProductBox);
      const nowDateTime = DateTimes.now();
      const remainQuantity = await this.checkPromotion(
        promotionProductBox,
        totalStock,
        nowDateTime,
        items[i],
      );
      if (remainQuantity > 0) Cashier.#addRegularOrderItem(items[i], remainQuantity);
    }
  }

  async checkPromotion(promotionProductBox, totalStock, nowDateTime, item) {
    const { name, quantity } = item;
    if (!promotionProductBox.isActivePromotion(nowDateTime)) return quantity;
    const additionalQuantity = promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Cashier.#isEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      if (additionalQuantity > 0) {
        const answer = await Cashier.#handleAdditionalPromotion(additionalQuantity, name);
        if (answer === 'Y') {
          Cashier.#addPromotionalOrderItem(item, quantity + 1, promotionProductBox);
          return 0;
        }
        Cashier.#addPromotionalOrderItem(item, quantity, promotionProductBox);
        return 0;
      }
    }
    const unappliedQuantity = promotionProductBox.calculateUnappliedQuantity(totalStock, quantity);
    if (unappliedQuantity > 0) {
      const answer = await Cashier.#handleUnappliedPromotion(unappliedQuantity, name);
      if (answer === 'Y') {
        Cashier.#addPromotionalOrderItem(item, totalStock, promotionProductBox);
        return quantity - totalStock;
      }
      Cashier.#addPromotionalOrderItem(item, quantity - unappliedQuantity, promotionProductBox);
      return 0;
    }
    return quantity;
  }

  static #calculateTotalStock(promotionProductBox) {
    let totalStock = 0;
    if (promotionProductBox) totalStock += promotionProductBox.getQuantity();
    return totalStock;
  }

  static #isEnoughStockForPromotion(totalStock, quantity, additionalQuantity) {
    return totalStock >= quantity + additionalQuantity;
  }

  static async #handleAdditionalPromotion(additionalQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `현재 ${name}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
    return answer;
  }

  static async #handleUnappliedPromotion(unappliedQuantity, name) {
    const answer = await InputView.getValidatedAnswer(
      `현재 ${name} ${unappliedQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
    return answer;
  }

  static #addPromotionalOrderItem(item, quantity, promotionProductBox) {
    const promotionItemsQuantity = promotionProductBox.calculatePromotionItemsQuantity(quantity);
    const orderItemQuantity = quantity - promotionItemsQuantity;
    const orderItem = new OrderItem(item, orderItemQuantity, promotionItemsQuantity);
    console.log(
      `프로모션 재고 구매 : 주문 개수 - ${orderItemQuantity}, 증정 개수 - ${promotionItemsQuantity}`,
    );
  }

  static #addRegularOrderItem(item, orderItemQuantity) {
    const orderItem = new OrderItem(item, orderItemQuantity);
    console.log(`일반 재고 구매 :  주문개수 - ${orderItemQuantity}`);
  }
}
export default Cashier;
