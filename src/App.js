import ConvenienceStoreController from './controller/ConvenienceStoreController.js';

class App {
  constructor() {
    this.convenienceStore = new ConvenienceStoreController();
  }

  async run() {
    await this.convenienceStore.start();
  }
}

export default App;
