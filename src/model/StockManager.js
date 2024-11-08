import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';

class StockManager {
  #shoppingCart;

  #allProductBoxes;

  constructor(shoppingCart, allProductBoxes) {
    this.#shoppingCart = shoppingCart;
    this.#allProductBoxes = allProductBoxes;
  }

  #fintProductBoxbyName(productName) {
    const matchingBoxes = this.#allProductBoxes.filter((box) => {
      return box.getProductName() === productName;
    });

    const productBox = matchingBoxes.find((box) => box instanceof ProductBox);
    const promotionProductBox = matchingBoxes.find((box) => box instanceof PromotionProductBox);
    return { productBox, promotionProductBox };
  }

  findBoxesForCartItems() {
    return this.#shoppingCart.getItems().map(({ name, getQuantity }) => {
      const { productBox, promotionProductBox } = this.#fintProductBoxbyName(name);
      return { productBox, promotionProductBox };
    });
  }
}

export default StockManager;
