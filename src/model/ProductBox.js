import { formatWithUnit } from '../utils/formatUnit.js';

class ProductBox {
  #product;

  #quantity;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  getDetails() {
    return `${this.#product.getDetails()} ${formatWithUnit(this.#quantity, '개')}`;
  }
}

export default ProductBox;
