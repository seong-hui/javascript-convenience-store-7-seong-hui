import StockManager from '../../src/model/StockManager';
import Product from '../../src/model/Product';
import ProductBox from '../../src/model/ProductBox';
import PromotionProductBox from '../../src/model/PromotionProductBox';
import Promotion from '../../src/model/Promotion';

const promotionRecord = {
  name: '골라골라',
  buy: '2',
  get: '1',
  start_date: '2024-11-11',
  end_date: '2024-12-27',
};

let productBox;
let promotion;
let promotionProductBox;

beforeEach(() => {
  const product = new Product('사이다', 1000);
  productBox = new ProductBox(product, 10);
  promotion = new Promotion(promotionRecord);
  promotionProductBox = new PromotionProductBox(productBox, promotion);
});

describe('calculateTotalStock 메서드 - 프로모션 박스와 일반 박스로부터 총 수량을 구함', () => {
  test.each([
    ['일반 박스와 프로모션 박스가 모두 있는 경우', () => promotionProductBox, () => productBox, 20],
    ['일반 박스만 있는 경우', () => null, () => productBox, 10],
    ['프로모션 박스만 있는 경우', () => promotionProductBox, () => null, 10],
    ['모든 박스가 없는 경우', () => null, () => null, 0],
  ])('%s', (_, getPromotionBox, getProductBox, expected) => {
    const totalStock = StockManager.calculateTotalStock(getPromotionBox(), getProductBox());
    expect(totalStock).toBe(expected);
  });
});
