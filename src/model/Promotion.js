class Promotion {
  #name;

  #buy;

  #get;

  #startDate;

  #endDate;

  constructor(promotionRecord) {
    this.#name = promotionRecord.name;
    this.#buy = parseInt(promotionRecord.buy, 10);
    this.#get = parseInt(promotionRecord.get, 10);
    this.#startDate = new Date(promotionRecord.start_date);
    this.#endDate = new Date(promotionRecord.end_date);
  }

  getName() {
    return this.#name;
  }

  isActive(currentDate) {
    return this.#startDate <= currentDate && currentDate <= this.#endDate;
  }

  // 프로모션을 적용해서 증정으로 받는 수량 계산
  calculateAdditionalPromotionQuantity(quantity) {
    let additionalPromotionQuantity = 0;
    const remainQuantity = quantity % (this.#buy + this.#get);
    if (remainQuantity === this.#buy) additionalPromotionQuantity += this.#get;
    return additionalPromotionQuantity;
  }
}
export default Promotion;
