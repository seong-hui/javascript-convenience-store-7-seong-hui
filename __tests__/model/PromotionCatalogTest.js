import PromotionCatalog from '../../src/model/PromotionCatalog';
import Promotion from '../../src/model/Promotion';

const promotionRecords = [
  {
    name: '골라골라',
    buy: '2',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '싸요싸요',
    buy: '10',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '할인할인',
    buy: '9007199254740991',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
];

let catalog;

beforeEach(() => {
  catalog = new PromotionCatalog();
  catalog.addPromotions(promotionRecords);
});

test('addPromotions 메서드 - 프로모션 추가', () => {
  const promotions = catalog.getAllPromotions();
  expect(promotions).toHaveLength(promotionRecords.length);
});

test('getAllPromotions 메서드 - 모든 프로모션 반환', () => {
  const promotions = catalog.getAllPromotions();
  expect(promotions).toHaveLength(promotionRecords.length);

  promotions.forEach((promotion, index) => {
    expect(promotion.getName()).toBe(promotionRecords[index].name);
  });
});

test('findPromotionByName 메서드 - 존재하는 이름으로 프로모션 검색', () => {
  const promotions = catalog.findPromotionByName('골라골라');
  expect(promotions).toBeInstanceOf(Promotion);
  expect(promotions.getName()).toBe('골라골라');
});

test('findPromotionByName 메서드 - 존재하지 않는 이름 검색', () => {
  const promotions = catalog.findPromotionByName('없는 프로모션');
  expect(promotions).toBeUndefined();
});
