import Validator from '../validator/Validator.js';
import CartItem from './CartItem.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

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
      throw new Error(ERROR_MESSAGES.NON_EXIST_PRODUCT);
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
