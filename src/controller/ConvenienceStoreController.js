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
    const { storedProducts, allProductBoxes } = await this.initialSetupStore();
    OutputView.printProducts(this.getProductDetails(allProductBoxes));

    this.manageShoppingCartInput(storedProducts);
  }

  static async initialSetupStore() {
    const promotionCatalog = await this.setUpPromotions();
    const { storedProducts, productRecords } = await this.setUpProducts();
    const allProductBoxes = this.createAllProductBoxes(productRecords, storedProducts);
    return { storedProducts, allProductBoxes };
  }

  static async setUpPromotions() {
    const promotionFileContent = await readFileContent('public/promotions.md');
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    return this.createPromotionCatalog(promotionRecords);
  }

  static async setUpProducts() {
    const productFileContent = await readFileContent('public/products.md');
    const productRecords = Parser.parseFileContentToRecords(productFileContent);
    const storedProducts = this.createProducts(productRecords);
    return { storedProducts, productRecords };
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

      allProductBoxes.push(this.createBox(productBox, promotion));
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

  static async manageShoppingCartInput(storedProducts) {
    while (true) {
      try {
        const inputItems = await catchParseReturn(InputView.readItem, Parser.parseItemToRecords);
        return new ShoppingCart(storedProducts, inputItems);
      } catch (error) {
        OutputView.printError(error);
      }
    }
  }
}

export default ConvenienceStoreController;
