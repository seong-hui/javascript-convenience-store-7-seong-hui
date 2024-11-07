import { MissionUtils } from '@woowacourse/mission-utils';
import ProductBox from '../model/ProductBox.js';
import PromotionProductBox from '../model/PromotionProductBox.js';

const OutputView = {
  printError(error) {
    MissionUtils.Console.print(`[ERROR] ${error}\n`);
  },

  printProducts(allBoxes) {
    allBoxes.forEach((box) => {
      if (box instanceof PromotionProductBox) {
        MissionUtils.Console.print(box.getInfo());
      } else if (box instanceof ProductBox) {
        MissionUtils.Console.print(box.getInfo());
      }
    });
  },
};

export default OutputView;
