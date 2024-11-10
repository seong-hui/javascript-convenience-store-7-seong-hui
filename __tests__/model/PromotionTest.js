import Promotion from '../../src/model/Promotion';

const validPromotionRecords = [
  {
    name: '유효한프로모션',
    buy: '2',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '유효한프로모션',
    buy: '10',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '유효한프로모션',
    buy: '9007199254740991',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
];

const invalidPromotionRecords = [
  {
    name: '유효하지_않은_프로모션1',
    buy: '0', // buy 값이 0인 경우
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '유효하지_않은_프로모션2',
    buy: '2',
    get: '0', // get 값이 1이 아닌 경우
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '', // 프로모션 이름이 없는 경우
    buy: '2',
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
  {
    name: '유효하지_않은_프로모션3',
    buy: '9007199254740992', // buy 값이 MAX_SAFE_INTEGER를 넘어가는 경우
    get: '1',
    start_date: '2024-11-11',
    end_date: '2024-12-27',
  },
];

describe('유효한 데이터로 Promotion 클래스 생성 테스트', () => {
  test.each(validPromotionRecords)('Promotion 생성 성공', (record) => {
    expect(() => new Promotion(record)).not.toThrow();
  });
});

describe('유효하지 않은 데이터로 Promotion 클래스 생성 테스트', () => {
  test.each(invalidPromotionRecords)('Promotion 생성 실패', (record) => {
    expect(() => new Promotion(record)).toThrow(Error);
  });
});

const promotionRecord = {
  name: '골라골라',
  buy: '2',
  get: '1',
  start_date: '2024-11-11',
  end_date: '2024-12-27',
};

const promotion = new Promotion(promotionRecord);

describe('Promotion클래스 메서드 테스트', () => {
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
});
