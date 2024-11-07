import Promotion from './promotion.js';

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
}

export default PromotionCatalog;
