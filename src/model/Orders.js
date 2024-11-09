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

  calculateTotalPrice() {
    return this.#orderItems.reduce((sum, orderItem) => {
      return sum + orderItem.calculateOrderPrice();
    }, 0);
  }

  calculateMembershipDiscountPrice() {
    const totalPrice = this.calculateTotalPrice();
    const totalDiscountPrice = this.calculateTotalDiscountPrice();
    const discountedAmount = totalPrice - totalDiscountPrice;
    const membershipDiscount = Math.round(discountedAmount * 0.3);
    if (membershipDiscount >= 3000) return 3000;
    return membershipDiscount;
  }

  calculateTotalDue() {
    const totalPrice = this.calculateTotalPrice();
    const totalDiscountPrice = this.calculateTotalDiscountPrice();
    const membershipDiscountPrice = this.calculateMembershipDiscountPrice();

    return totalPrice - totalDiscountPrice - membershipDiscountPrice;
  }
}
export default Orders;
