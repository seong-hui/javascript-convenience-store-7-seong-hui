import { formatWithUnit } from '../utils/formatUnit.js';

class ProductBox {
  #product;

  #quantity;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  getDetails() {
    return `${this.#product.getDetails()} ${this.#getQuantityText()}`;
  }

  #getQuantityText() {
    if (this.#quantity <= 0) return '재고 없음';
    return formatWithUnit(this.#quantity, '개');
  }

  getProductName() {
    return this.#product.getName();
  }
}

export default ProductBox;
