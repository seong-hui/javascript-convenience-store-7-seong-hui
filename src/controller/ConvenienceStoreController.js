import StockManager from '../model/StockManager.js';
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
import Cashier from '../model/Cashier.js';

class ConvenienceStoreController {
  #shoppingCart;

  async start() {
    const { storedProducts, allProductBoxes } = await ConvenienceStoreController.initialSetupStore();
    OutputView.printProducts(ConvenienceStoreController.getProductDetails(allProductBoxes));

    await this.validateCartFromInput(storedProducts, allProductBoxes);

    const cashier = new Cashier(allProductBoxes);
    const orders = await cashier.handleOrders(this.#shoppingCart);
    ConvenienceStoreController.printReceipt(orders);
  }

  static printReceipt(orders) {
    OutputView.printString('==============W 편의점================');
    OutputView.printString('상품명\t\t\t수량\t금액');
    OutputView.printOrderDetails(orders.getOrdersDetails());
    OutputView.printPromotionDetails(orders.getOrdersDetails());
    OutputView.printString('======================================');
    ConvenienceStoreController.printAllPrices(orders);
  }

  static printAllPrices(orders) {
    const priceDetails = {
      totalPrice: orders.calculateTotalPrice(),
      totalDiscountPrice: orders.calculateTotalDiscountPrice(),
      membershipDiscountPrice: orders.calculateMembershipDiscountPrice(),
      totalDue: orders.calculateTotalDue(),
      totalQuantity: orders.calculateTotalQuantity(),
    };
    OutputView.printAllPrices(priceDetails);
  }

  static async initialSetupStore() {
    const promotionCatalog = await ConvenienceStoreController.setUpPromotions();
    const { storedProducts, productRecords } = await ConvenienceStoreController.setUpProducts();
    const allProductBoxes = ConvenienceStoreController.createAllProductBoxes(
      productRecords,
      storedProducts,
      promotionCatalog,
    );
    return { storedProducts, allProductBoxes };
  }

  static async setUpPromotions() {
    const promotionFileContent = await readFileContent('public/promotions.md');
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    return ConvenienceStoreController.createPromotionCatalog(promotionRecords);
  }

  static async setUpProducts() {
    const productFileContent = await readFileContent('public/products.md');
    const productRecords = Parser.parseFileContentToRecords(productFileContent);
    const storedProducts = ConvenienceStoreController.createProducts(productRecords);
    return { storedProducts, productRecords };
  }

  static parseInputItems(inputItems) {
    return Parser.parseItemToRecords(inputItems);
  }

  static createProducts(productRecords) {
    const uniqueProducts = createUniqueProduct(productRecords);
    return uniqueProducts.map(({ name, price }) => new Product(name, price));
  }

  static createBox(productBox, promotion, promotionCatalog) {
    if (promotion !== 'null') {
      const targetPromotion = promotionCatalog.findPromotionByName(promotion);
      return new PromotionProductBox(productBox, targetPromotion);
    }
    return productBox;
  }

  static createAllProductBoxes(productRecords, products, promotionCatalog) {
    const allProductBoxes = [];
    productRecords.forEach(({ name, price, quantity, promotion }) => {
      const targetProduct = products.find((product) => product.matchNameAndPrice(name, price));
      const productBox = new ProductBox(targetProduct, quantity);

      allProductBoxes.push(ConvenienceStoreController.createBox(productBox, promotion, promotionCatalog));
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

  async validateCartFromInput(storedProducts, allProductBoxes) {
    while (true) {
      try {
        await this.#setupShoppingCartFromInput(storedProducts);
        return this.#validateCartWithStock(allProductBoxes);
      } catch (error) {
        OutputView.printError(error);
      }
    }
  }

  async #setupShoppingCartFromInput(storedProducts) {
    const inputItems = await catchParseReturn(InputView.readItem, Parser.parseItemToRecords);
    this.#shoppingCart = new ShoppingCart(storedProducts, inputItems);
  }

  #validateCartWithStock(allProductBoxes) {
    const stockManager = new StockManager(allProductBoxes);
    return stockManager.findValidBoxesForCartItems(this.#shoppingCart);
  }
}

export default ConvenienceStoreController;
