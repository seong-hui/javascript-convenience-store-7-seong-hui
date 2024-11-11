import Orders from '../../src/model/Orders';
import OrderItem from '../../src/model/OrderItem';
import Product from '../../src/model/Product';
import DISCOUNT_POLICY from '../../src/constants/discountPolicy';

let orders;
let firstOrderItem;
let secondOrderItem;

beforeEach(() => {
  orders = new Orders();

  const cider = new Product('사이다', 1000);
  const cola = new Product('콜라', 1500);

  firstOrderItem = new OrderItem(cider, true, 3, 2); // 프로모션 재고에서 구매
  secondOrderItem = new OrderItem(cola, false, 5); // 일반 재고에서 구매(비프로모션 상품)
});

test('addOrderItem 메서드 - 주문 항목 추가', () => {
  orders.addOrderItem(firstOrderItem);
  orders.addOrderItem(secondOrderItem);

  const details = orders.getOrdersDetails();
  expect(details).toEqual([
    {
      product: '사이다',
      price: 5000,
      totalQuantity: 5,
      promotionQuantity: 2,
    },
    {
      product: '콜라',
      price: 7500,
      totalQuantity: 5,
      promotionQuantity: 0,
    },
  ]);
});

test('addOrderItem 메서드 - 동일 상품 추가 시 수량 증가', () => {
  orders.addOrderItem(firstOrderItem);
  orders.addOrderItem(new OrderItem(new Product('사이다', 1000), true, 2, 1)); // 추가 주문

  const details = orders.getOrdersDetails();
  expect(details[0]).toEqual({
    product: '사이다',
    price: 8000,
    totalQuantity: 8,
    promotionQuantity: 3,
  });
});

test('calculateTotalPrice 메서드 - 총 주문 가격 계산', () => {
  orders.addOrderItem(firstOrderItem);
  orders.addOrderItem(secondOrderItem);

  const totalPrice = orders.calculateTotalPrice();
  expect(totalPrice).toBe(12500);
});

test('calculateTotalDiscountPrice 메서드 - 총 할인 금액 계산', () => {
  orders.addOrderItem(firstOrderItem);

  const totalDiscountPrice = orders.calculateTotalDiscountPrice();
  expect(totalDiscountPrice).toBe(2000);
});

test('calculateMembershipDiscountPrice 메서드 - 멤버십 할인 계산', () => {
  orders.addOrderItem(secondOrderItem); // 일반 재고에서 구매하는 상품(비프로모션)만 적용

  const nonPromotionPrice = orders.calcualteTotalNonPromotionPrice(); // 5 * 1500 = 7500
  const expectedDiscount = Math.round(nonPromotionPrice * DISCOUNT_POLICY.MEMBERSHIP_DISCOUNT_PERSENT);
  const membershipDiscount = orders.calculateMembershipDiscountPrice(true);

  if (expectedDiscount >= DISCOUNT_POLICY.MEMBERSHIP_DISCOUNT_LIMIT) {
    expect(membershipDiscount).toBe(DISCOUNT_POLICY.MEMBERSHIP_DISCOUNT_LIMIT);
  } else {
    expect(membershipDiscount).toBe(expectedDiscount);
  }
});

test('calculateTotalDue 메서드 - 최종 결제 금액 계산', () => {
  orders.addOrderItem(firstOrderItem);
  orders.addOrderItem(secondOrderItem);

  const totalDue = orders.calculateTotalDue(true);
  const totalPrice = orders.calculateTotalPrice();
  const totalDiscountPrice = orders.calculateTotalDiscountPrice();
  const membershipDiscountPrice = orders.calculateMembershipDiscountPrice(true);

  expect(totalDue).toBe(totalPrice - totalDiscountPrice - membershipDiscountPrice);
});

test('calculateTotalQuantity 메서드 - 전체 주문 수량 계산', () => {
  orders.addOrderItem(firstOrderItem);
  orders.addOrderItem(secondOrderItem);

  const totalQuantity = orders.calculateTotalQuantity();
  expect(totalQuantity).toBe(10);
});

test('calcualteTotalNonPromotionPrice 메서드 - 총 비프로모션 상품 가격 계산', () => {
  orders.addOrderItem(secondOrderItem);

  const totalNonPromotionPrice = orders.calcualteTotalNonPromotionPrice();
  expect(totalNonPromotionPrice).toBe(7500);
});
