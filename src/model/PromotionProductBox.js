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

  isActivePromotion(currentDate) {
    return this.#promotion.isActive(currentDate);
  }

  calculateAdditionalPromotionQuantity(quantity) {
    return this.#promotion.calculateAdditionalPromotionQuantity(quantity);
  }
}

export default PromotionProductBox;
