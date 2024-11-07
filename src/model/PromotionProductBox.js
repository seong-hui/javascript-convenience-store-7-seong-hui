class PromotionProductBox {
  #productBox;

  #promotion;

  constructor(productBox, promotion) {
    this.#productBox = productBox;
    this.#promotion = promotion;
  }

  getInfo() {
    return `${this.#productBox.getInfo()} ${this.#promotion}`;
  }
}

export default PromotionProductBox;
