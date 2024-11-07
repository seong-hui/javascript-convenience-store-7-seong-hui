import readFileContent from './utils/readFileContent.js';
import Parser from './parser/Parser.js';
import PromotionController from './controller/PromotionController.js';

class App {
  async run() {
    const promotionFileContent = await readFileContent('public/promotions.md');
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    const promotionCatalog = PromotionController.createPromotionCatalog(promotionRecords);
  }
}

export default App;
