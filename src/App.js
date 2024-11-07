import readFileContent from './utils/readFileContent.js';
import Parser from './parser/Parser.js';
import PromotionController from './controller/PromotionController.js';
import ProductController from './controller/ProductController.js';
import OutputView from './view/outputView.js';

class App {
  async run() {
    const promotionFileContent = await readFileContent('public/promotions.md');
    const promotionRecords = Parser.parseFileContentToRecords(promotionFileContent);
    const promotionCatalog = PromotionController.createPromotionCatalog(promotionRecords);

    const productFileContent = await readFileContent('public/products.md');
    const productRecords = Parser.parseFileContentToRecords(productFileContent);
    const products = ProductController.createProducts(productRecords);

    const allProductBoxes = ProductController.createAllProductBoxes(productRecords, products);
    ProductController.printProducts(allProductBoxes, OutputView);
  }
}

export default App;
