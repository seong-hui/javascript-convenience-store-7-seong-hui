import { MissionUtils } from '@woowacourse/mission-utils';
import STORE_MESSAGES from '../constants/storeMessages.js';
import { VALID_ANSWERS } from '../constants/constants.js';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(STORE_MESSAGES.REQUEST_PURCHASE_PRODUCT);
    return input;
  },

  async readAnswer(question) {
    const input = await MissionUtils.Console.readLineAsync(question);
    return input;
  },

  async getValidatedAnswer(promptMessage) {
    let answer = '';
    const validAnswers = Object.values(VALID_ANSWERS);
    while (!validAnswers.includes(answer)) {
      answer = await InputView.readAnswer(promptMessage);
      answer = answer.trim();
      if (!validAnswers.includes(answer)) MissionUtils.Console.print('[ERROR] Y 또는 N만 입력 가능합니다.\n');
    }
    return answer;
  },

  async readUserConfirmation(message) {
    const answer = await InputView.getValidatedAnswer(message);
    if (answer === VALID_ANSWERS.YES) return true;
    return false;
  },

  async askToContinueShopping() {
    const userAnswer = await InputView.readUserConfirmation(STORE_MESSAGES.ASK_CONTINUE_SHOPPING);
    return userAnswer;
  },
};

export default InputView;
