import { MissionUtils } from '@woowacourse/mission-utils';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );
    return input;
  },

  async readAnswer(question) {
    const input = await MissionUtils.Console.readLineAsync(question);
    return input;
  },

  async getValidatedAnswer(promptMessage) {
    let answer = '';
    while (!['Y', 'N'].includes(answer)) {
      answer = await InputView.readAnswer(promptMessage);
      answer = answer.trim();
      if (!['Y', 'N'].includes(answer)) MissionUtils.Console.print('[ERROR] Y 또는 N만 입력 가능합니다.\n');
    }
    return answer;
  },

  async readUserConfirmation(message) {
    const answer = await InputView.getValidatedAnswer(message);
    if (answer === 'Y') return true;
    return false;
  },

  async askToContinueShopping() {
    const userAnswer = await InputView.readUserConfirmation('\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n');
    return userAnswer;
  },
};

export default InputView;
