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

  #allProductBoxes;

  async start() {
    const { storedProducts, allProductBoxes } = await this.initialSetupStore();

    while (true) {
      OutputView.printString('안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n');
      OutputView.printProducts(this.#getProductDetails());
      await this.validateCartFromInput(storedProducts);
      const cashier = new Cashier(this.#allProductBoxes);
      const orders = await cashier.handleOrders(this.#shoppingCart);
      ConvenienceStoreController.printReceipt(orders);

      const continueShopping = await ConvenienceStoreController.#readUserAnswer();
      if (!continueShopping) break;
    }
  }

  static async #readUserAnswer() {
    const answer = await InputView.getValidatedAnswer('\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n\n');
    if (answer === 'Y') return 1;
    return 0;
  }

  async initialSetupStore() {
    const promotionCatalog = await ConvenienceStoreController.setUpPromotions();
    const { storedProducts, productRecords } = await ConvenienceStoreController.setUpProducts();
    const allProductBoxes = ConvenienceStoreController.createAllProductBoxes(
      productRecords,
      storedProducts,
      promotionCatalog,
    );
    this.#allProductBoxes = allProductBoxes;
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

  #getProductDetails() {
    return this.#allProductBoxes.map((productBox) => {
      return productBox.getDetails();
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
        return this.#validateCartWithStock(this.#allProductBoxes);
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
}

export default ConvenienceStoreController;
