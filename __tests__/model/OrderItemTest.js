import OrderItem from '../../src/model/OrderItem';
import Product from '../../src/model/Product';

let product;
let orderItem;

beforeEach(() => {
  product = new Product('사이다', 1000);
  orderItem = new OrderItem(product, true, 3, 2); // 주문 상품, 프로모션 재고인가, 주문 수량, 프로모션을 수량
});

test('getProductName 메서드 - 상품 이름 가져오기', () => {
  expect(orderItem.getProductName()).toBe('사이다');
});

test('matchProduct 메서드 - 같은 상품인지 확인', () => {
  const sameOrderItem = new OrderItem(product, true, 1);
  expect(orderItem.matchProduct(sameOrderItem)).toBe(true);

  const differentProduct = new Product('콜라', 1500);
  const differentOrderItem = new OrderItem(differentProduct, false, 1);
  expect(orderItem.matchProduct(differentOrderItem)).toBe(false);
});

test('getOrderItemQuantity 메서드 - 주문 수량 가져오기', () => {
  expect(orderItem.getOrderItemQuantity()).toBe(3);
});

test('getPromotionItemsQuantity 메서드 - 프로모션 수량 가져오기', () => {
  expect(orderItem.getPromotionItemsQuantity()).toBe(2);
});

test('increaseQuantity 메서드 - 주문 수량 증가', () => {
  orderItem.increaseQuantity(5, 3); // 주문 수량, 프로모션 수량
  expect(orderItem.getOrderItemQuantity()).toBe(8);
  expect(orderItem.getPromotionItemsQuantity()).toBe(5);
});

test('calculateOrderPrice 메서드 - 총 주문 가격 계산', () => {
  expect(orderItem.calculateOrderPrice()).toBe(5000);
});

test('calculateDiscountPrice 메서드 - 할인 가격 계산', () => {
  expect(orderItem.calculateDiscountPrice()).toBe(2000);
});

test('calcualteTotalQuantity 메서드 - 주문 수량과 프로모션 수량을 합한 수량 계산', () => {
  expect(orderItem.calcualteTotalQuantity()).toBe(5);
});

test('calculateNonPrmotionPrice 메서드 - 주문 상품 가격 계산(프로모션 재고에서 구매하는 것이 아닌 경우)', () => {
  const nonPromotionOrderItem = new OrderItem(product, false, 3);
  expect(nonPromotionOrderItem.calculateNonPrmotionPrice()).toBe(3000);

  expect(orderItem.calculateNonPrmotionPrice()).toBe(0);
});
