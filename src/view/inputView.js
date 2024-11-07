import { MissionUtils } from '@woowacourse/mission-utils';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      // ...
    );
    // ...
  },
};

export default InputView;
