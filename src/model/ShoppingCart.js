import Validator from '../validator/Validator.js';

class ShoppingCart {
  #cartItems;

  #storedProducts;

  constructor(storedProducts, inputItems) {
    this.#cartItems = [];
    this.#storedProducts = storedProducts;
    this.#validate(inputItems);
  }

  #validate(items) {
    items.forEach(({ name, quantity }) => {
      this.#checkValidItem(name, quantity);
    });
  }

  #checkValidItem(name, quantity) {
    this.#checkExistingProduct(name);
    Validator.checkValidQuantity(quantity);
  }

  #checkExistingProduct(name) {
    if (!this.#storedProducts.some((storedProduct) => storedProduct.matchName(name)))
      throw new Error('존재하지 않는 상품입니다. 다시 입력해 주세요.');
  }
}

export default ShoppingCart;
