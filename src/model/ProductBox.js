class ProductBox {
  #product;

  #quantity;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  getDetails() {
    return `${this.#product.getDetails()} ${this.#quantity}개`;
  }
}

export default ProductBox;
