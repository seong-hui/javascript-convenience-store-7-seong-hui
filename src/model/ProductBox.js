import { UNIT, NON_EXIST_QUANTITY } from '../constants/constants.js';
import { formatWithUnit } from '../utils/formatUnit.js';

class ProductBox {
  #product;

  #quantity;

  constructor(product, quantity = 0) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  getDetails() {
    return `${this.#product.getDetails()} ${this.#getQuantityText()}`;
  }

  #getQuantityText() {
    if (this.#quantity <= 0) return NON_EXIST_QUANTITY;
    return formatWithUnit(this.#quantity, UNIT.COUNT);
  }

  getProductName() {
    return this.#product.getName();
  }

  getQuantity() {
    return this.#quantity;
  }

  reduceQuantity(amount) {
    this.#quantity -= amount;
  }

  setQuantity(quantity) {
    this.#quantity = quantity;
  }

  matchName(name) {
    return this.#product.matchName(name);
  }
}

export default ProductBox;
