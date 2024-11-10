import ProductBox from './ProductBox.js';
import PromotionProductBox from './PromotionProductBox.js';

class BoxesInventory {
  #allProductBoxes;

  constructor() {
    this.#allProductBoxes = [];
  }

  addBox(box) {
    const existingBox = this.findProductBoxByName(box.getProductName());
    if (existingBox) {
      existingBox.setQuantity(existingBox.getQuantity() + box.getQuantity());
      return;
    }

    this.#allProductBoxes.push(box);
  }

  findProductBoxByName(name) {
    return this.#allProductBoxes.find((box) => box instanceof ProductBox && box.matchName(name));
  }

  findPromotionBoxByName(name) {
    return this.#allProductBoxes.find((box) => box instanceof PromotionProductBox && box.matchName(name));
  }

  getDetails() {
    return this.#allProductBoxes.map((box) => box.getDetails());
  }
}

export default BoxesInventory;
