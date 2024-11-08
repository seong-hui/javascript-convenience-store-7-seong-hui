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
}
export default Promotion;
