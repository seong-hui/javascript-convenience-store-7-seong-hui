class Orders {
  #orderItems;

  constructor() {
    this.#orderItems = [];
  }

  addOrderItem(orderItem) {
    const existingOrderItem = this.#orderItems.find((item) => item.matchProduct(orderItem));
    if (existingOrderItem) {
      existingOrderItem.increaseQuantity(orderItem.getOrderItemQuantity(), orderItem.getPromotionItemsQuantity());
      return;
    }
    this.#orderItems.push(orderItem);
  }

  getOrdersDetails() {
    return this.#orderItems.map((orderItem) => ({
      product: orderItem.getProductName(),
      price: orderItem.calculateOrderPrice(),
      orderQuantity: orderItem.getOrderItemQuantity(),
      promotionQuantity: orderItem.getPromotionItemsQuantity(),
    }));
  }

  calculateTotalDiscountPrice() {
    return this.#orderItems.reduce((sum, orderItem) => {
      return sum + orderItem.calculateDiscountPrice();
    }, 0);
  }
}
export default Orders;
