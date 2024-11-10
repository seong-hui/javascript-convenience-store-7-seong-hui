import ConvenienceStoreController from './controller/ConvenienceStoreController.js';

class App {
  constructor() {
    this.convenienceStore = new ConvenienceStoreController();
  }

  async run() {
    await this.convenienceStore.initialSetupStore();

    while (true) {
      await this.convenienceStore.startShopping();
      if (!(await ConvenienceStoreController.askContinueShopping())) break;
    }
  }
}

export default App;
