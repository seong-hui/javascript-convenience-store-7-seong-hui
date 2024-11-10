import Promotion from '../../src/model/Promotion';

const promotionRecord = {
  name: '골라골라',
  buy: '2',
  get: '1',
  start_date: '2024-11-11',
  end_date: '2024-12-27',
};

const promotion = new Promotion(promotionRecord);

test.each([
  ['2024-11-15', true],
  ['2024-10-25', false],
  ['2025-01-01', false],
])('isActive 메서드 - %s 날짜 입력 시 %s 반환', (date, expected) => {
  const currentDate = new Date(date);
  expect(promotion.isActive(currentDate)).toBe(expected);
});

test.each([
  [5, 1],
  [2, 1],
  [4, 0],
  [9, 0],
])('calculateAdditionalQuantity 메서드 - %d개 구매시 %d개 증정', (quantity, expected) => {
  expect(promotion.calculateAdditionalQuantity(quantity)).toBe(expected);
});

test.each([
  [5, 6, 3],
  [8, 10, 4],
  [2, 15, 15],
])(
  'calculateUnappliedQuantity 메서드 - 총 %d개의 재고가 있을 때 %d개 구매시 %d개 프로모션 미적용',
  (totalStock, quantity, expected) => {
    expect(promotion.calculateUnappliedQuantity(totalStock, quantity)).toBe(expected);
  },
);

test.each([
  [5, 1],
  [2, 0],
  [10, 3],
  [15, 5],
])('calculatePromotionItemsQuantity 메서드 - %d개 구매시 %d개 프로모션 적용', (quantity, expected) => {
  expect(promotion.calculatePromotionItemsQuantity(quantity)).toBe(expected);
});
