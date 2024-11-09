import Validator from '../validator/Validator.js';
import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';

class StockManager {
  #allProductBoxes;

  constructor(allProductBoxes) {
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
    shoppingCart.getItems().forEach(({ product, quantity }) => {
      const { productBox, promotionProductBox } = this.#findProductBoxbyName(product.getName());
      const totalStock = StockManager.#calculateTotalStock(productBox, promotionProductBox);
      Validator.checkStockAvailable(totalStock, quantity);
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
