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

  getQuantity() {
    return this.#productBox.getQuantity();
  }
}

export default PromotionProductBox;
