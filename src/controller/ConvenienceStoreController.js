import Product from '../model/Product.js';
import ProductBox from '../model/ProductBox.js';
import PromotionCatalog from '../model/PromotionCatalog.js';
import PromotionProductBox from '../model/PromotionProductBox.js';
import ShoppingCart from '../model/ShoppingCart.js';
import Parser from '../parser/Parser.js';
import catchParseReturn from '../utils/catchValidReturn.js';
import createUniqueProduct from '../utils/createUniqueProduct.js';
import readFileContent from '../utils/readFileContent.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';

class ConvenienceStoreController {
  static async start() {
    const { products, allProductBoxes } = await ConvenienceStoreController.initialSetupStore();
    const productDetails = ConvenienceStoreController.getProductDetails(allProductBoxes);
    OutputView.printProducts(productDetails);

    while (true) {
      try {
        const inputItems = await catchParseReturn(InputView.readItem, Parser.parseItemToRecords);
        return new ShoppingCart(products, inputItems);
      } catch (error) {
        OutputView.printError(error);
      }
    }
  }

  static async initialSetupStore() {
    const promotionFileContent = await readFileContent('public/promotions.md');
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    const promotionCatalog = ConvenienceStoreController.createPromotionCatalog(promotionRecords);
    const productFileContent = await readFileContent('public/products.md');
    const productRecords = Parser.parseFileContentToRecords(productFileContent);
    const products = ConvenienceStoreController.createProducts(productRecords);
    const allProductBoxes = ConvenienceStoreController.createAllProductBoxes(
      productRecords,
      products,
    );
    return { products, allProductBoxes };
  }

  static parseInputItems(inputItems) {
    return Parser.parseItemToRecords(inputItems);
  }

  static createShoppingCart(products, items) {
    return new ShoppingCart(products, items);
  }

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

      allProductBoxes.push(ConvenienceStoreController.createBox(productBox, promotion));
    });
    return allProductBoxes;
  }

  static getProductDetails(allProductBoxes) {
    return allProductBoxes.map((productBox) => {
      return productBox.getDetails();
    });
  }

  static createPromotionCatalog(promotionRecords) {
    const promotionCatalog = new PromotionCatalog();
    promotionCatalog.addPromotions(promotionRecords);
    return promotionCatalog;
  }
}

export default ConvenienceStoreController;
