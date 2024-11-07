import { MissionUtils } from '@woowacourse/mission-utils';

const OutputView = {
  printProducts() {
    MissionUtils.Console.print('- 콜라 1,000원 10개 탄산2+1');
  },

  printError(error) {
    MissionUtils.Console.print(`[ERROR] ${error}\n`);
  },
};

export default OutputView;
