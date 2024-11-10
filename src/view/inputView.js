import { MissionUtils } from '@woowacourse/mission-utils';
import STORE_MESSAGES from '../constants/storeMessages.js';
import { VALID_ANSWERS } from '../constants/constants.js';
import Validator from '../validator/Validator.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(STORE_MESSAGES.REQUEST_PURCHASE_PRODUCT);
    return input;
  },

  async getValidatedAnswer(promptMessage) {
    const answer = await await MissionUtils.Console.readLineAsync(promptMessage);
    if (!Validator.isValidAnswer(answer)) throw new Error(ERROR_MESSAGES.INVALID_ANSWER);
    if (answer.trim() === VALID_ANSWERS.YES) return true;
    return false;
  },
};

export default InputView;
