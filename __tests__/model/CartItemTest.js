import CartItem from '../../src/model/CartItem';
import Product from '../../src/model/Product';

let cartItem;
let product;

beforeEach(() => {
  product = new Product('사이다', 1000);
  cartItem = new CartItem(product, 5);
});

test('getProduct 메서드 - Product 객체 가져오기', () => {
  expect(cartItem.getProduct()).toBe(product);
});

test.each([
  ['수량 5에서 3 증가', 3, 8],
  ['수량 5에서 7 증가', 7, 12],
  ['수량 5에서 0 증가', 0, 5],
])('increaseQuantity 메서드 - %s', (_, amount, expectedy) => {
  cartItem.increaseQuantity(amount);
  expect(cartItem.getQuantity()).toBe(expectedy);
});

test.each([
  ['일치하는 상품', new Product('사이다', 1000), true],
  ['이름이 일치하지 않는 상품', new Product('콜라', 1000), false],
  ['가격이 일치하지 않는 상품', new Product('사이다', 1500), false],
])('matchProduct 메서드 - %s', (_, otherProduct, expected) => {
  expect(cartItem.matchProduct(otherProduct)).toBe(expected);
});
