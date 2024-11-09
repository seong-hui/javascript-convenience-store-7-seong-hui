import Validator from '../validator/Validator.js';
import CartItem from './CartItem.js';

class ShoppingCart {
  #cartItems;

  #storedProducts;

  constructor(storedProducts, inputItems) {
    this.#cartItems = [];
    this.#storedProducts = storedProducts;
    this.#validateAndAddItems(inputItems);
  }

  #validateAndAddItems(items) {
    items.forEach(({ name, quantity }) => {
      this.#checkValidItem(name, quantity);
      const targetItem = this.#findStoredProductByName(name);
      this.#addItem(targetItem, quantity);
    });
  }

  #addItem(targetItem, quantity) {
    const existingCartItem = this.#findCartItem(targetItem);
    if (existingCartItem) {
      existingCartItem.increaseQuantity(quantity);
      return;
    }
    this.#cartItems.push(new CartItem(targetItem, quantity));
  }

  #findCartItem(product) {
    return this.#cartItems.find((cartItem) => cartItem.matchProduct(product));
  }

  #checkValidItem(name, quantity) {
    this.#checkExistingProduct(name);
    Validator.checkValidQuantity(quantity);
  }

  #checkExistingProduct(name) {
    if (!this.#storedProducts.some((storedProduct) => storedProduct.matchName(name)))
      throw new Error('존재하지 않는 상품입니다. 다시 입력해 주세요.');
  }

  #findStoredProductByName(name) {
    return this.#storedProducts.find((storedProduct) => storedProduct.matchName(name));
  }

  getItems() {
    return this.#cartItems.map((cartItem) => ({
      product: cartItem.getProduct(),
      quantity: cartItem.getQuantity(),
    }));
  }
}

export default ShoppingCart;
