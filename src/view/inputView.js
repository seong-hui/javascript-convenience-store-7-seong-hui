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
    }
    return answer;
  },

  async readUserResponse(message) {
    const answer = await InputView.getValidatedAnswer(message);
    if (answer === 'Y') return true;
    return false;
  },
};

export default InputView;
