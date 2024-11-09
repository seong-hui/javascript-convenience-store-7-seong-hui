import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InputView from '../view/InputView.js';

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
      const { name, quantity } = items[i];
      const { productBox, promotionProductBox } = this.#findProductBoxbyName(name);
      const totalStock = Cashier.#calculateTotalStock(promotionProductBox);
      const nowDateTime = DateTimes.now();
      await this.checkPromotion(promotionProductBox, quantity, totalStock, nowDateTime, name);
    }
  }

  async checkPromotion(promotionProductBox, quantity, totalStock, nowDateTime, name) {
    if (!promotionProductBox.isActivePromotion(nowDateTime)) return;
    const additionalQuantity = promotionProductBox.calculateAdditionalQuantity(quantity);
    if (Cashier.#isEnoughStockForPromotion(totalStock, quantity, additionalQuantity)) {
      await Cashier.#handleAdditionalPromotion(additionalQuantity, name);
      return;
    }
    await Cashier.#handleUnappliedPromotion(promotionProductBox, totalStock, quantity, name);
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
    if (additionalQuantity > 0)
      await InputView.readAnswer(
        `현재 ${name}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
      );
  }

  static async #handleUnappliedPromotion(promotionProductBox, totalStock, quantity, name) {
    const unappliedQuantity = promotionProductBox.calculateUnappliedQuantity(totalStock, quantity);
    await InputView.readAnswer(
      `현재 ${name} ${unappliedQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
  }
}
export default Cashier;
