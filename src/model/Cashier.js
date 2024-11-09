import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';
import { DateTimes } from '@woowacourse/mission-utils';

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

  findValidBoxesForCartItems(shoppingCart) {
    return shoppingCart.getItems().map(({ name, quantity }) => {
      const { productBox, promotionProductBox } = this.#findProductBoxbyName(name);
      const totalStock = Cashier.#calculateTotalStock(promotionProductBox);
      const nowDateTime = DateTimes.now();
      this.checkPromotion(promotionProductBox, quantity, totalStock, nowDateTime);
    });
  }

  checkPromotion(promotionProductBox, quantity, totalStock, nowDateTime) {
    if (!promotionProductBox.isActivePromotion(nowDateTime)) return;
    const additionalQuantity = promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Cashier.#isEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      Cashier.#handleAdditionalPromotion(additionalQuantity);
      return;
    }
    Cashier.#handleUnappliedPromotion(promotionProductBox, totalStock, quantity);
  }

  static #calculateTotalStock(promotionProductBox) {
    let totalStock = 0;
    if (promotionProductBox) totalStock += promotionProductBox.getQuantity();
    return totalStock;
  }

  static #isEnoughStockForPromotion(totalStock, quantity, additionalQuantity) {
    return totalStock >= quantity + additionalQuantity;
  }

  static #handleAdditionalPromotion(additionalQuantity) {
    if (additionalQuantity > 0)
      console.log(`${additionalQuantity}를 무료로 받을 수 있습니다. 추가하시겠습니까?`);
  }

  static #handleUnappliedPromotion(promotionProductBox, totalStock, quantity) {
    const unappliedQuantity = promotionProductBox.calculateUnappliedQuantity(totalStock, quantity);
    console.log(`${unappliedQuantity}개는 프로모션 할인이 적용되지 않습니다.`);
  }
}
export default Cashier;
