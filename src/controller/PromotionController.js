import PromotionCatalog from '../model/PromotionCatalog.js';

class PromotionController {
  static createPromotionCatalog(promotionRecords) {
    const promotionCatalog = new PromotionCatalog();
    promotionCatalog.addPromotions(promotionRecords);
    return promotionCatalog;
  }
}

export default PromotionController;
