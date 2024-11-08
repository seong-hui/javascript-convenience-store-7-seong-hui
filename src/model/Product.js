import { formatPriceWithUnit } from '../utils/formatUnit.js';

class Product {
  #name;

  #price;

  constructor(name, price) {
    this.#name = name;
    this.#price = parseInt(price, 10);
  }

  getName() {
    return this.#name;
  }

  getPrice() {
    return this.#price;
  }

  getDetails() {
    return `${this.#name} ${formatPriceWithUnit(this.#price)}`;
  }

  matchNameAndPrice(name, price) {
    return this.#name === name && this.#price === parseInt(price, 10);
  }

  matchName(name) {
    return this.#name === name;
  }
}

export default Product;
