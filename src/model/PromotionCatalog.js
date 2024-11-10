import Promotion from './Promotion.js';

class PromotionCatalog {
  #promotions;

  constructor() {
    this.#promotions = [];
  }

  addPromotions(promotionRecords) {
    promotionRecords.forEach((promotionRecord) => {
      const promotion = new Promotion(promotionRecord);
      this.#promotions.push(promotion);
    });
  }

  getAllPromotions() {
    return this.#promotions;
  }

  findPromotionByName(name) {
    return this.#promotions.find((promotion) => promotion.getName() === name);
  }
}

export default PromotionCatalog;
