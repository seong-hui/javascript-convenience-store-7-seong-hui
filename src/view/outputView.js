import { MissionUtils } from '@woowacourse/mission-utils';
import { formatProductLine, formatPromotionLine } from '../utils/formatLine.js';
import { RECEIPT_TEMPLATE, RECEIPT_LABELS } from '../constants/receipt.js';
import { ERROR_LABEL } from '../constants/errorMessages.js';
import STORE_MESSAGES from '../constants/storeMessages.js';
import { PRODUCT_DIVIDER } from '../constants/constants.js';

const OutputView = {
  printError(error) {
    MissionUtils.Console.print(`${ERROR_LABEL} ${error.message}\n`);
  },

  printProducts(productDetails) {
    productDetails.forEach((productDetail) => {
      MissionUtils.Console.print(`${PRODUCT_DIVIDER} ${productDetail}`);
    });
  },

  printOrderDetails(orderDetails) {
    orderDetails.forEach(({ product, totalQuantity, price }) => {
      MissionUtils.Console.print(formatProductLine(product, totalQuantity, price));
    });
  },

  printPromotionDetails(orderDetails) {
    MissionUtils.Console.print(RECEIPT_TEMPLATE.PROMOTION_DIVIDER);
    orderDetails
      .filter(({ promotionQuantity }) => promotionQuantity > 0)
      .forEach(({ product, promotionQuantity }) => {
        MissionUtils.Console.print(formatPromotionLine(product, promotionQuantity));
      });
  },

  printAllPrices({ totalPrice, totalDiscountPrice, membershipDiscountPrice, totalDue, totalQuantity }) {
    MissionUtils.Console.print(`${RECEIPT_LABELS.TOTAL_PRICE}\t\t${totalQuantity}\t${totalPrice.toLocaleString()}`);
    MissionUtils.Console.print(`${RECEIPT_LABELS.TOTAL_DISCOUNT}\t\t\t-${totalDiscountPrice.toLocaleString()}`);
    MissionUtils.Console.print(
      `${RECEIPT_LABELS.MEMBERSHIP_DISCOUNT}\t\t\t-${membershipDiscountPrice.toLocaleString()}`,
    );
    MissionUtils.Console.print(`${RECEIPT_LABELS.TOTAL_DUE}\t\t\t\t ${totalDue.toLocaleString()}`);
  },

  printString(string) {
    MissionUtils.Console.print(string);
  },

  printReceipt(orders, isMambership) {
    this.printString(RECEIPT_TEMPLATE.RECEIPT_HEADER);
    this.printString(RECEIPT_TEMPLATE.ORDER_SUMMARY_HEADER);
    this.printOrderDetails(orders.getOrdersDetails());
    this.printPromotionDetails(orders.getOrdersDetails());
    this.printString(RECEIPT_TEMPLATE.RECEIPT_DIVIDER);
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
    OutputView.printString(STORE_MESSAGES.WELCOME_NOTIFICATION);
    OutputView.printProducts(productDetails);
  },
};

export default OutputView;
