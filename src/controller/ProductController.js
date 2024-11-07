import Product from '../model/Product.js';
import ProductBox from '../model/ProductBox.js';
import PromotionProductBox from '../model/PromotionProductBox.js';
import createUniqueProduct from '../utils/createUniqueProduct.js';

class ProductController {
  static createProducts(productRecords) {
    const uniqueProducts = createUniqueProduct(productRecords);
    return uniqueProducts.map(({ name, price }) => new Product(name, price));
  }

  static createAllProductBoxes(productRecords, products) {
    const allProductBoxes = [];
    productRecords.forEach(({ name, price, quantity, promotion }) => {
      const product = products.find((product) => product.matchNameAndPrice(name, price));
      const productBox = new ProductBox(product, quantity);

      if (promotion !== 'null') {
        allProductBoxes.push(new PromotionProductBox(productBox, promotion));
      } else {
        allProductBoxes.push(productBox);
      }
    });
    return allProductBoxes;
  }
}

export default ProductController;
