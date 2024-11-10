import ProductBox from '../../src/model/ProductBox';
import Product from '../../src/model/Product';
import { UNIT, NON_EXIST_QUANTITY } from '../../src/constants/constants';
import { formatWithUnit } from '../../src/utils/formatUnit';

let productBox;
let product;

beforeEach(() => {
  product = new Product('사이다', 1000);
  productBox = new ProductBox(product, 10);
});

test('getDetails 메서드 - 상품 상세 정보와 수량 가져오기', () => {
  const details = productBox.getDetails();
  const expectedQuantity = formatWithUnit(10, UNIT.COUNT);
  expect(details).toBe(`사이다 1,000원 ${expectedQuantity}`);
});

test('getDetails 메서드 - 수량이 0일 때 NON_EXIST_QUANTITY 가져오기', () => {
  productBox.setQuantity(0);
  const details = productBox.getDetails();
  expect(details).toBe(`사이다 1,000원 ${NON_EXIST_QUANTITY}`);
});

test('getProductName 메서드 - 상품 이름 가져오기', () => {
  expect(productBox.getProductName()).toBe('사이다');
});

test('getQuantity 메서드 - 수량 가져오기', () => {
  expect(productBox.getQuantity()).toBe(10);
});

test('reduceQuantity 메서드 - 수량 감소하기', () => {
  productBox.reduceQuantity(3);
  expect(productBox.getQuantity()).toBe(7);
});

test('setQuantity 메서드 - 수량 설정하기', () => {
  productBox.setQuantity(20);
  expect(productBox.getQuantity()).toBe(20);
});

test.each([
  ['일치하는 이름', '사이다', true],
  ['일치하지 않는 이름', '콜라', false],
])('matchName 메서드 테스트 - %s', (_, name, expected) => {
  expect(productBox.matchName(name)).toBe(expected);
});
