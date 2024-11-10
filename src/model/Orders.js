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
      totalQuantity: orderItem.calcualteTotalQuantity(),
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

  calculateMembershipDiscountPrice(isMembership) {
    if (!isMembership) return 0;
    const nonPrmotionPrice = this.calcualteTotalNonPromotionPrice();
    const membershipDiscount = Math.round(nonPrmotionPrice * 0.3);

    if (membershipDiscount >= 8000) return 8000;
    return membershipDiscount;
  }

  calculateTotalDue(isMembership) {
    const totalPrice = this.calculateTotalPrice();
    const totalDiscountPrice = this.calculateTotalDiscountPrice();
    const membershipDiscountPrice = this.calculateMembershipDiscountPrice(isMembership);

    return totalPrice - totalDiscountPrice - membershipDiscountPrice;
  }

  calculateTotalQuantity() {
    return this.#orderItems.reduce((sum, orderItem) => {
      return sum + orderItem.calcualteTotalQuantity();
    }, 0);
  }

  calcualteTotalNonPromotionPrice() {
    return this.#orderItems.reduce((sum, orderItem) => {
      return sum + orderItem.calculateNonPrmotionPrice();
    }, 0);
  }
}
export default Orders;
