class Product {
  #name;

  #price;

  constructor(name, price) {
    this.#name = name;
    this.#price = parseInt(price, 10);
  }

  getName() {
    return this.#name;
  }

  getPrice() {
    return this.#price;
  }

  getInfo() {
    return `- ${this.#name} ${this.#price}원`;
  }
}

export default Product;
