import ConvenienceStoreController from './controller/ConvenienceStoreController.js';

class App {
  async run() {
    await ConvenienceStoreController.start();
  }
}

export default App;
