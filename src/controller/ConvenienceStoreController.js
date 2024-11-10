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

class ConvenienceStoreController {
  #shoppingCart;

  #boxesInventory;

  constructor() {
    this.#boxesInventory = new BoxesInventory();
  }

  async start() {
    const storedProducts = await this.initialSetupStore();

    while (true) {
      OutputView.printString('안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n');
      OutputView.printProducts(this.#boxesInventory.getDetails());
      await this.validateCartFromInput(storedProducts);
      const cashier = new Cashier(this.#boxesInventory);
      const orders = await cashier.handleOrders(this.#shoppingCart);
      const isMambership = await InputView.readUserResponse('\n멤버십 할인을 받으시겠습니까? (Y/N)\n');
      ConvenienceStoreController.printReceipt(orders, isMambership);
      const continueShopping = await InputView.readUserResponse(
        '\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n\n',
      );
      if (!continueShopping) break;
    }
  }

  async initialSetupStore() {
    const promotionCatalog = await ConvenienceStoreController.setUpPromotions();
    const { storedProducts, productRecords } = await ConvenienceStoreController.setUpProducts();
    this.#createAllProductBoxes(productRecords, storedProducts, promotionCatalog);
    return storedProducts;
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

  #createAllProductBoxes(productRecords, products, promotionCatalog) {
    productRecords.forEach(({ name, price, quantity, promotion }) => {
      const targetProduct = products.find((product) => product.matchNameAndPrice(name, price));
      const productBox = new ProductBox(targetProduct, quantity);

      this.#createBox(productBox, promotion, promotionCatalog, targetProduct);
    });
  }

  static createPromotionCatalog(promotionRecords) {
    const promotionCatalog = new PromotionCatalog();
    promotionCatalog.addPromotions(promotionRecords);
    return promotionCatalog;
  }

  async validateCartFromInput(storedProducts) {
    while (true) {
      try {
        await this.#setupShoppingCartFromInput(storedProducts);
        return this.#validateCartWithStock();
      } catch (error) {
        OutputView.printError(error);
      }
    }
  }

  async #setupShoppingCartFromInput(storedProducts) {
    const inputItems = await catchParseReturn(InputView.readItem, Parser.parseItemToRecords);
    this.#shoppingCart = new ShoppingCart(storedProducts, inputItems);
  }

  #validateCartWithStock() {
    return StockManager.findValidBoxesForCartItems(this.#shoppingCart, this.#boxesInventory);
  }

  static printReceipt(orders, isMambership) {
    OutputView.printString('==============W 편의점================');
    OutputView.printString('상품명\t\t\t수량\t금액');
    OutputView.printOrderDetails(orders.getOrdersDetails());
    OutputView.printPromotionDetails(orders.getOrdersDetails());
    OutputView.printString('======================================');
    ConvenienceStoreController.printAllPrices(orders, isMambership);
  }

  static printAllPrices(orders, isMambership) {
    const priceDetails = {
      totalPrice: orders.calculateTotalPrice(),
      totalDiscountPrice: orders.calculateTotalDiscountPrice(),
      membershipDiscountPrice: orders.calculateMembershipDiscountPrice(isMambership),
      totalDue: orders.calculateTotalDue(isMambership),
      totalQuantity: orders.calculateTotalQuantity(),
    };
    OutputView.printAllPrices(priceDetails);
  }
}
export default ConvenienceStoreController;
