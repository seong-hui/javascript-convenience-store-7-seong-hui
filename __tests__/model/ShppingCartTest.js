import ShoppingCart from '../../src/model/ShoppingCart';
import Product from '../../src/model/Product';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages';
import Validator from '../../src/validator/Validator';

jest.mock('../../src/validator/Validator');

const storedProducts = [
  new Product('사이다', 1000),
  new Product('콜라', 1000),
  new Product('물', 500),
  new Product('컵라면', 1500),
  new Product('빼빼로', 1800),
];

const basicInputItems = [
  { name: '사이다', quantity: 10 },
  { name: '콜라', quantity: 2 },
  { name: '빼빼로', quantity: 3 },
];

beforeEach(() => {
  Validator.checkValidQuantity.mockImplementation((quantity) => {
    if (quantity < 1 || quantity > Number.MAX_SAFE_INTEGER) throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
  });
});

test('장바구니에 아이템 추가', () => {
  const shoppingCart = new ShoppingCart(storedProducts, basicInputItems);
  const items = shoppingCart.getItems();
  expect(items).toEqual([
    { product: storedProducts[0], quantity: 10 },
    { product: storedProducts[1], quantity: 2 },
    { product: storedProducts[1], quantity: 3 },
  ]);
});

test('장바구니에 중복된 아이템 추가 시 수량만 증가', () => {
  const inputItems = [
    { name: '빼빼로', quantity: 3 },
    { name: '빼빼로', quantity: 2 },
  ];
  const shoppingCart = new ShoppingCart(storedProducts, inputItems);

  const items = shoppingCart.getItems();
  expect(items).toEqual([{ product: storedProducts[0], quantity: 5 }]);
});

test('존재하지 않는 상품(storedProducts에 없는 상품) 추가시 예외 발생', () => {
  const inputItems = [{ name: '아몬드빼빼로', quantity: 2 }];
  expect(() => new ShoppingCart(storedProducts, inputItems)).toThrow(ERROR_MESSAGES.NON_EXIST_PRODUCT);
});

describe('유효하지 않은 수량 추가시 예외 발생', () => {
  test.each([
    ['0이하일 때', [{ name: '사이다', quantity: 0 }], ERROR_MESSAGES.INVALID_QUANTITY],
    ['0이하일 때', [{ name: '콜라', quantity: -10 }], ERROR_MESSAGES.INVALID_QUANTITY],
    ['MAX_SAFE_INTEGER를 넘어갈 때', [{ name: '사이다', quantity: 9007199254740992 }], ERROR_MESSAGES.INVALID_QUANTITY],
  ])('%s', (_, inputItems, expectedError) => {
    expect(() => new ShoppingCart(storedProducts, inputItems)).toThrow(expectedError);
  });
});
