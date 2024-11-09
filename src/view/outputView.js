import { MissionUtils } from '@woowacourse/mission-utils';
import { formatProductLine, formatPromotionLine } from '../utils/formatLine.js';

const OutputView = {
  printError(error) {
    MissionUtils.Console.print(`[ERROR] ${error}\n`);
  },

  printProducts(productDetails) {
    productDetails.forEach((productDetail) => {
      MissionUtils.Console.print(`- ${productDetail}`);
    });
  },

  printOrderDetails(orderDetails) {
    orderDetails.forEach(({ product, orderQuantity, price }) => {
      MissionUtils.Console.print(formatProductLine(product, orderQuantity, price));
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
};

export default OutputView;
