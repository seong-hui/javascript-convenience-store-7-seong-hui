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

  calculateAdditionalQuantity(quantity) {
    return this.#promotion.calculateAdditionalQuantity(quantity);
  }

  calculateUnappliedQuantity(totalStock, quantity) {
    return this.#promotion.calculateUnappliedQuantity(totalStock, quantity);
  }
}

export default PromotionProductBox;
