import { MissionUtils } from '@woowacourse/mission-utils';
import { formatProductLine, formatPromotionLine } from '../utils/formatLine.js';

const OutputView = {
  printError(error) {
    MissionUtils.Console.print(`[ERROR] ${error.message}\n`);
  },

  printProducts(productDetails) {
    productDetails.forEach((productDetail) => {
      MissionUtils.Console.print(`- ${productDetail}`);
    });
  },

  printOrderDetails(orderDetails) {
    orderDetails.forEach(({ product, totalQuantity, price }) => {
      MissionUtils.Console.print(formatProductLine(product, totalQuantity, price));
    });
  },

  printPromotionDetails(orderDetails) {
    MissionUtils.Console.print('============증\t\t정============');
    orderDetails
      .filter(({ promotionQuantity }) => promotionQuantity > 0)
      .forEach(({ product, promotionQuantity }) => {
        MissionUtils.Console.print(formatPromotionLine(product, promotionQuantity));
      });
  },

  printAllPrices({ totalPrice, totalDiscountPrice, membershipDiscountPrice, totalDue, totalQuantity }) {
    MissionUtils.Console.print(`총구매액\t\t${totalQuantity}\t ${totalPrice.toLocaleString()}`);
    MissionUtils.Console.print(`행사할인\t\t\t-${totalDiscountPrice.toLocaleString()}`);
    MissionUtils.Console.print(`멤버십할인\t\t\t-${membershipDiscountPrice.toLocaleString()}`);
    MissionUtils.Console.print(`내실돈\t\t\t\t ${totalDue.toLocaleString()}`);
  },

  printString(string) {
    MissionUtils.Console.print(string);
  },

  printReceipt(orders, isMambership) {
    this.printString('\n==============W 편의점================');
    this.printString('상품명\t\t\t수량\t금액');
    this.printOrderDetails(orders.getOrdersDetails());
    this.printPromotionDetails(orders.getOrdersDetails());
    this.printString('======================================');
    this.printPriceSummary(orders, isMambership);
  },

  printPriceSummary(orders, isMembership) {
    const priceDetails = {
      totalPrice: orders.calculateTotalPrice(),
      totalDiscountPrice: orders.calculateTotalDiscountPrice(),
      membershipDiscountPrice: orders.calculateMembershipDiscountPrice(isMembership),
      totalDue: orders.calculateTotalDue(isMembership),
      totalQuantity: orders.calculateTotalQuantity(),
    };
    this.printAllPrices(priceDetails);
  },

  printWellcomWithProducts(productDetails) {
    OutputView.printString('\n안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n');
    OutputView.printProducts(productDetails);
  },
};

export default OutputView;
