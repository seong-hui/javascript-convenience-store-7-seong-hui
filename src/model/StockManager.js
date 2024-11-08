import Validator from '../validator/Validator.js';
import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';

class StockManager {
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

  findValidBoxesForCartItems() {
    return this.#shoppingCart.getItems().map(({ name, quantity }) => {
      const { productBox, promotionProductBox } = this.#findProductBoxbyName(name);
      const totalStock = StockManager.#calculateTotalStock(productBox, promotionProductBox);
      Validator.checkStockAvailable(totalStock, quantity);
      return { productBox, promotionProductBox };
    });
  }

  static #calculateTotalStock(productBox, promotionProductBox) {
    let totalStock = 0;
    if (productBox) totalStock += productBox.getQuantity();
    if (promotionProductBox) totalStock += promotionProductBox.getQuantity();
    return totalStock;
  }
}

export default StockManager;
