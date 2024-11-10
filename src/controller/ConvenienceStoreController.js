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
import BoxesInventory from '../model/BoxesInventory.js';
import STORE_MESSAGES from '../constants/storeMessages.js';
import ABSOLUTE_FILE_PATH from '../constants/absolutefilePath.js';

class ConvenienceStoreController {
  #shoppingCart;

  #boxesInventory;

  #storedProducts;

  constructor() {
    this.#boxesInventory = new BoxesInventory();
  }

  async startShopping() {
    OutputView.printWellcomWithProducts(this.#boxesInventory.getDetails());
    await this.requestShoppingItem();
    const orderResult = await this.#manageOrders();
    const isMembership = await ConvenienceStoreController.#askMembershipDiscount();
    OutputView.printReceipt(orderResult, isMembership);
  }

  async initialSetupStore() {
    const promotionCatalog = await ConvenienceStoreController.setUpPromotions();
    const productRecords = await this.#setUpProducts();
    this.#createAllProductBoxes(productRecords, promotionCatalog);
  }

  static async setUpPromotions() {
    const promotionFileContent = await readFileContent(ABSOLUTE_FILE_PATH.PROMOTION);
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    return ConvenienceStoreController.createPromotionCatalog(promotionRecords);
  }

  async #setUpProducts() {
    const productFileContent = await readFileContent(ABSOLUTE_FILE_PATH.PRODUCT);
    const productRecords = Parser.parseFileContentToRecords(productFileContent);
    this.#storedProducts = ConvenienceStoreController.createProducts(productRecords);
    return productRecords;
  }

  static createProducts(productRecords) {
    const uniqueProducts = createUniqueProduct(productRecords);
    return uniqueProducts.map(({ name, price }) => new Product(name, price));
  }

  #createBox(productBox, promotion, promotionCatalog, targetProduct) {
    if (promotion !== 'null') {
      const targetPromotion = promotionCatalog.findPromotionByName(promotion);
      const promotionProductBox = new PromotionProductBox(productBox, targetPromotion);
      this.#boxesInventory.addBox(promotionProductBox);
      this.#boxesInventory.addBox(new ProductBox(targetProduct));
      return;
    }
    this.#boxesInventory.addBox(productBox);
  }

  #createAllProductBoxes(productRecords, promotionCatalog) {
    productRecords.forEach(({ name, price, quantity, promotion }) => {
      const targetProduct = this.#storedProducts.find((product) => product.matchNameAndPrice(name, price));
      const productBox = new ProductBox(targetProduct, quantity);

      this.#createBox(productBox, promotion, promotionCatalog, targetProduct);
    });
  }

  static createPromotionCatalog(promotionRecords) {
    const promotionCatalog = new PromotionCatalog();
    promotionCatalog.addPromotions(promotionRecords);
    return promotionCatalog;
  }

  async requestShoppingItem() {
    while (true) {
      try {
        await this.#setupShoppingCartFromInput(this.#storedProducts);
        return this.#validateCartWithStock();
      } catch (error) {
        OutputView.printError(error);
      }
    }
  }

  async #setupShoppingCartFromInput() {
    const inputItems = await catchParseReturn(InputView.readItem, Parser.parseItemToRecords);
    this.#shoppingCart = new ShoppingCart(this.#storedProducts, inputItems);
  }

  #validateCartWithStock() {
    return StockManager.findValidBoxesForCartItems(this.#shoppingCart, this.#boxesInventory);
  }

  async #manageOrders() {
    const cashier = new Cashier(this.#boxesInventory);
    const orders = await cashier.handleOrders(this.#shoppingCart, InputView.readUserConfirmation);
    return orders;
  }

  static async #askMembershipDiscount() {
    const isMambership = await InputView.readUserConfirmation(STORE_MESSAGES.ASK_MEMBERSHIP_DISCOUNT);
    return isMambership;
  }

  static async askContinueShopping() {
    const isContinue = await InputView.askToContinueShopping();
    return isContinue;
  }
}
export default ConvenienceStoreController;
