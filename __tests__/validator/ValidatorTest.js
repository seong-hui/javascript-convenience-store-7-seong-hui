import Validator from '../../src/validator/Validator';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages';
import { VALID_ANSWERS } from '../../src/constants/constants';

describe('isValidItemFormat 메서드 테스트 - 상품 이름과 가격이 유효한 형식으로 들어왔는지 확인', () => {
  test.each([
    ['유효한 형식 "[사이다-10]"', '[사이다-10]', true],
    ['유효한 형식 "[cola-20]"', '[cola-20]', true],
    ['유효하지 않은 형식 "사이다-10"', '사이다-10', false],
    ['유효하지 않은 형식 "[사이다10]"', '[사이다10]', false],
    ['유효하지 않은 형식 "[사이다]"', '[사이다]', false],
  ])('%s', (_, input, expected) => {
    expect(Validator.isValidItemFormat(input)).toBe(expected);
  });
});

describe('checkValidQuantity 메서드 테스트 - 유효한 수량이 들어왔는지 확인', () => {
  test.each([
    ['유효한 수량', 1],
    ['유효한 수량', 1000],
  ])('%s', (_, quantity) => {
    expect(() => Validator.checkValidQuantity(quantity)).not.toThrow();
  });

  test.each([
    ['유효하지 않은 수량 - 0 이하', 0, ERROR_MESSAGES.INVALID_QUANTITY],
    ['유효하지 않은 수량 - MAX_SAFE_INTEGER 초과', Number.MAX_SAFE_INTEGER + 1, ERROR_MESSAGES.INVALID_QUANTITY],
  ])('%s', (_, quantity, expectedError) => {
    expect(() => Validator.checkValidQuantity(quantity)).toThrow(expectedError);
  });
});

describe('checkStockAvailable 메서드 테스트 - 구매하기에 충분한 수량이 있는지 확인', () => {
  test.each([
    ['유효한 재고', 10, 5],
    ['유효한 재고', 5, 5],
  ])('%s', (_, availableQuantity, quantity) => {
    expect(() => Validator.checkStockAvailable(availableQuantity, quantity)).not.toThrow();
  });

  test.each([
    ['유효하지 않은 재고', 0, 5],
    ['유효하지 않은 재고', 3, 10],
  ])('%s', (_, availableQuantity, quantity) => {
    expect(() => Validator.checkStockAvailable(availableQuantity, quantity)).toThrow(
      ERROR_MESSAGES.OVER_STOCK_QUANTITY,
    );
  });
});

describe('checkEnoughStockForPromotion 메서드 테스트 - 프로모션으 증정을 합한 수량이 있는지 확인', () => {
  test.each([
    ['유효한 재고 - 프로모션 재고 충분', 10, 5, 3, true],
    ['유효하지 않은 재고 -프로모션 재고 부족', 5, 3, 3, false],
  ])('%s', (_, totalPromotionStock, quantity, additionalQuantity, expected) => {
    expect(Validator.checkEnoughStockForPromotion(totalPromotionStock, quantity, additionalQuantity)).toBe(expected);
  });
});

describe('isValidAnswer 메서드 테스트 - Y,N 둘중에 하나로 대답했는지 확인', () => {
  test.each([
    ['유효한 응답 "Y"', VALID_ANSWERS.YES, true],
    ['유효한 응답 "N"', VALID_ANSWERS.NO, true],
    ['유효하지 않은 응답', 'y', false],
    ['유효하지 않은 응답', '123', false],
  ])('%s', (_, answer, expected) => {
    expect(Validator.isValidAnswer(answer)).toBe(expected);
  });
});

describe('checkValidPromotionBuy 메서드 테스트 - 유효한 프로모션 수량이 들어왔는지 확인', () => {
  test.each([
    ['유효한 수량', 1],
    ['유효한 수량', 1000],
  ])('%s', (_, quantity) => {
    expect(() => Validator.checkValidPromotionBuy(quantity)).not.toThrow();
  });

  test.each([
    ['유효하지 않은 수량 - 0 이하', 0, ERROR_MESSAGES.INVALID_PROMOTION],
    ['유효하지 않은 수량 - MAX_SAFE_INTEGER 초과', Number.MAX_SAFE_INTEGER + 1, ERROR_MESSAGES.INVALID_PROMOTION],
  ])('%s', (_, quantity, expectedError) => {
    expect(() => Validator.checkValidPromotionBuy(quantity)).toThrow(expectedError);
  });
});

describe('checkValidPromotionGet 메서드 테스트 - 증정 수량이 1인지 확인(Buy N Get 1 Free)', () => {
  test.each([['유효한 프로모션 수량', 1]])('%s', (_, input) => {
    expect(Validator.checkValidPromotionGet(input)).toBe(1);
  });

  test.each([
    ['유효한 하지 않은 프로모션 수량 - 1이 아닌 경우', 2, ERROR_MESSAGES.INVALID_PROMOTION],
    ['유효한 하지 않은 프로모션 수량 - 1이 아닌 경우', 0, ERROR_MESSAGES.INVALID_PROMOTION],
  ])('%s', (_, input, expectedError) => {
    expect(() => Validator.checkValidPromotionGet(input)).toThrow(expectedError);
  });
});

describe('checkIsNull 메서드 테스트 - 널값 체크', () => {
  test.each([['유효한 입력', '반짝세일', '반짝세일']])('%s', (_, input, expected) => {
    expect(Validator.checkIsNull(input)).toBe(expected);
  });

  test.each([['유효하지 않은 값', null, ERROR_MESSAGES.INVALID_PROMOTION]])('%s', (_, input, expectedError) => {
    expect(() => Validator.checkIsNull(input)).toThrow(expectedError);
  });
});
