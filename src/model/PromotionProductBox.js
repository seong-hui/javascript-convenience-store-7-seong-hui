class PromotionProductBox {
  #productBox;

  #promotion;

  constructor(productBox, promotion) {
    this.#productBox = productBox;
    this.#promotion = promotion;
  }

  getDetails() {
    return `${this.#productBox.getDetails()} ${this.#promotion.getName()}`;
  }

  getProductName() {
    return this.#productBox.getProductName();
  }
}

export default PromotionProductBox;
