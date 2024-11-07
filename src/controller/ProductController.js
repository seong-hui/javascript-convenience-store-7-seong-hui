import Product from '../model/Product.js';
import createUniqueProduct from '../utils/createUniqueProduct.js';

class ProductController {
  static createProducts(productRecords) {
    const uniqueProducts = createUniqueProduct(productRecords);
    return uniqueProducts.map(({ name, price }) => new Product(name, price));
  }
}

export default ProductController;
