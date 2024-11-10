import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { VALID_ANSWERS } from '../constants/constants.js';

const Validator = {
  isValidItemFormat(item) {
    const itemRegex = /^\[([가-힣a-zA-Z0-9]+)-(\d+)\]$/;
    return itemRegex.test(item);
  },

  checkValidQuantity(quantity) {
    if (quantity < 1 || quantity > Number.MAX_SAFE_INTEGER) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
  },
  checkStockAvailable(availableQuantity, quantity) {
    if (availableQuantity < quantity) throw new Error(ERROR_MESSAGES.OVER_STOCK_QUANTITY);
  },

  checkEnoughStockForPromotion(totalPromotionStock, quantity, additionalQuantity) {
    return totalPromotionStock >= quantity + additionalQuantity;
  },

  isValidAnswer(answer) {
    const validAnswers = Object.values(VALID_ANSWERS);
    return validAnswers.includes(answer.trim());
  },
};

export default Validator;
