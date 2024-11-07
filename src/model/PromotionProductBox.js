class PromotionProductBox {
  #productBox;

  #promotion;

  constructor(productBox, promotion) {
    this.#productBox = productBox;
    this.#promotion = promotion;
  }

  getDetails() {
    return `${this.#productBox.getDetails()} ${this.#promotion}`;
  }
}

export default PromotionProductBox;
