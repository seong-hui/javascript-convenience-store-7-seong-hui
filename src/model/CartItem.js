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
}

export default CartItem;
