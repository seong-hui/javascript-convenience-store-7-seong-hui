class Product {
  #name;

  #price;

  constructor(name, price) {
    this.#name = name;
    this.#price = parseInt(price, 10);
  }
}

export default Product;
