class ProductBox {
  #product;

  #quantity;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  getInfo() {
    return `${this.#product.getInfo()} ${this.#quantity}개`;
  }
}

export default ProductBox;
