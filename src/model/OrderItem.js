class OrderItem {
  #product;

  #orderItemQuantity;

  #promotionItemsQuantity;

  constructor(product, orderItemQuantity, promotionItemsQuantity = 0) {
    this.#product = product;
    this.#orderItemQuantity = orderItemQuantity;
    this.#promotionItemsQuantity = promotionItemsQuantity;
  }

  getProductName() {
    return this.#product.getName();
  }

  matchProduct(orderItem) {
    return this.getProductName() === orderItem.getProductName();
  }

  increaseQuantity(orderItemQuantity, promotionItemsQuantity = 0) {
    this.#orderItemQuantity += orderItemQuantity;
    this.#promotionItemsQuantity += promotionItemsQuantity;
  }

  getOrderItemQuantity() {
    return this.#orderItemQuantity;
  }

  getPromotionItemsQuantity() {
    return this.#promotionItemsQuantity;
  }

  calculateOrderPrice() {
    return this.#orderItemQuantity * this.#product.getPrice();
  }

  calculateDiscountPrice() {
    return this.#promotionItemsQuantity * this.#product.getPrice();
  }
}

export default OrderItem;
