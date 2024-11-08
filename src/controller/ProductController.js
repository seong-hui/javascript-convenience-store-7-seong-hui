import Product from '../model/Product.js';
import ProductBox from '../model/ProductBox.js';
import PromotionProductBox from '../model/PromotionProductBox.js';
import createUniqueProduct from '../utils/createUniqueProduct.js';

class ProductController {
  static createProducts(productRecords) {
    const uniqueProducts = createUniqueProduct(productRecords);
    return uniqueProducts.map(({ name, price }) => new Product(name, price));
  }

  static createBox(productBox, promotion) {
    if (promotion !== 'null') {
      return new PromotionProductBox(productBox, promotion);
    }
    return productBox;
  }

  static createAllProductBoxes(productRecords, products) {
    const allProductBoxes = [];
    productRecords.forEach(({ name, price, quantity, promotion }) => {
      const targetProduct = products.find((product) => product.matchNameAndPrice(name, price));
      const productBox = new ProductBox(targetProduct, quantity);

      allProductBoxes.push(ProductController.createBox(productBox, promotion));
    });
    return allProductBoxes;
  }

  static getProductDetail(allProductBoxes) {
    return allProductBoxes.map((productBox) => {
      return productBox.getDetails();
    });
  }
}

export default ProductController;
