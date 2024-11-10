import Validator from '../validator/Validator.js';

class StockManager {
  static #findProductBoxbyName(productName, boxesInventory) {
    const productBox = boxesInventory.findProductBoxByName(productName);
    const promotionProductBox = boxesInventory.findPromotionBoxByName(productName);
    return { productBox, promotionProductBox };
  }

  static findValidBoxesForCartItems(shoppingCart, boxesInventory) {
    shoppingCart.getItems().forEach(({ product, quantity }) => {
      const { productBox, promotionProductBox } = StockManager.#findProductBoxbyName(product.getName(), boxesInventory);
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
