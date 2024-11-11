import PromotionProductBox from '../../src/model/PromotionProductBox';
import ProductBox from '../../src/model/ProductBox';
import Product from '../../src/model/Product';
import Promotion from '../../src/model/Promotion';

let promotionProductBox;
let productBox;
let promotion;

const promotionRecord = {
  name: '골라골라',
  buy: '2',
  get: '1',
  start_date: '2024-11-11',
  end_date: '2024-12-27',
};

beforeEach(() => {
  const product = new Product('사이다', 1000);
  productBox = new ProductBox(product, 10);
  promotion = new Promotion(promotionRecord);
  promotionProductBox = new PromotionProductBox(productBox, promotion);
});

test('getDetails 메서드 - 프로모션 박스의 상세정보 가져오기(이름, 가격, 수량, 프로모션 이름)', () => {
  const details = promotionProductBox.getDetails();
  expect(details).toBe(`사이다 1,000원 10개 골라골라`);
});

test('getProductName 메서드 - 상품 이름 가져오기', () => {
  expect(promotionProductBox.getProductName()).toBe('사이다');
});

test('getQuantity 메서드 - 프로모션 박스 안에 있는 상품 수량 가져오기', () => {
  expect(promotionProductBox.getQuantity()).toBe(10);
});

test('isActivePromotion 메서드 - 현재 유효한 프로모션인지 확인', () => {
  const activeDate = new Date('2024-11-11');
  const inactiveDate = new Date('2024-10-10');

  expect(promotionProductBox.isActivePromotion(activeDate)).toBe(true);
  expect(promotionProductBox.isActivePromotion(inactiveDate)).toBe(false);
});

test('calculateAdditionalQuantity 메서드 - 프로모션을 적용해서 증정으로 받는 수량 계산', () => {
  expect(promotionProductBox.calculateAdditionalQuantity(5)).toBe(1);
});

test('calculateUnappliedQuantity 메서드 - 프로모션이 적용되지 않는 수량 계산', () => {
  expect(promotionProductBox.calculateUnappliedQuantity(8, 10)).toBe(4);
});

test('calculatePromotionItemsQuantity 메서드 -  주어진 수량에서 프로모션이 적용된 수량 계산', () => {
  expect(promotionProductBox.calculatePromotionItemsQuantity(10)).toBe(3);
});

test('reduceQuantity 메서드 - 수량 감소', () => {
  promotionProductBox.reduceQuantity(3);
  expect(promotionProductBox.getQuantity()).toBe(7);
});

test('matchName 메서드 - 이름 일치 여부 확인', () => {
  expect(promotionProductBox.matchName('사이다')).toBe(true);
  expect(promotionProductBox.matchName('콜라')).toBe(false);
});
