class CartItem {
  #product;

  #quantity;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = parseInt(quantity, 10);
  }

  increaseQuantity(amount) {
    this.#quantity += parseInt(amount, 10);
  }

  matchProduct(product) {
    return this.#product.getName() === product.getName();
  }

  getProductName() {
    return this.#product.getName();
  }

  getQuantity() {
    return this.#quantity;
  }

  getProduct() {
    return this.#product;
  }
}

export default CartItem;
