import { MissionUtils } from '@woowacourse/mission-utils';

const OutputView = {
  printError(error) {
    MissionUtils.Console.print(`[ERROR] ${error}\n`);
  },

  printProducts(productDetails) {
    productDetails.forEach((productDetail) => {
      MissionUtils.Console.print(`- ${productDetail}`);
    });
  },
};

export default OutputView;
