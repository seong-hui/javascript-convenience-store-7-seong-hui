import BoxesInventory from '../../src/model/BoxesInventory';
import Product from '../../src/model/Product';
import ProductBox from '../../src/model/ProductBox';
import PromotionProductBox from '../../src/model/PromotionProductBox';
import Promotion from '../../src/model/Promotion';

let inventory;
let productBox1; // 프로모션이 존재하지 않는 상품들을 담아놓은 박스 - 일반 박스
let productBox2;
let promotion;
let promotionBox; // 프로모션이 존재하는 상품들을 담아놓은 박스 - 프로모션 박스

const promotionRecord = {
  name: '골라골라',
  buy: '2',
  get: '1',
  start_date: '2024-11-11',
  end_date: '2024-12-27',
};

beforeEach(() => {
  inventory = new BoxesInventory();
  const product1 = new Product('사이다', 1000);
  const product2 = new Product('콜라', 1500);

  productBox1 = new ProductBox(product1, 10);
  productBox2 = new ProductBox(product2, 5);
  promotion = new Promotion(promotionRecord);
  promotionBox = new PromotionProductBox(productBox1, promotion);
});

test('addBox 메서드 - 박스 인벤토리에 새로운 박스 추가', () => {
  inventory.addBox(productBox1);
  expect(inventory.getDetails()).toEqual([productBox1.getDetails()]);
});

test('addBox 메서드 - 동일한 상품을 보관하는 일반 박스가 있을 시 기존 박스의 수량 증가', () => {
  inventory.addBox(productBox1);
  inventory.addBox(new ProductBox(new Product('사이다', 1000), 5));
  const box = inventory.findProductBoxByName('사이다');

  expect(box.getQuantity()).toBe(15);
});

test('findProductBoxByName 메서드 - 이름으로 일반 박스 검색', () => {
  inventory.addBox(productBox1);
  const foundBox = inventory.findProductBoxByName('사이다');

  expect(foundBox).toBeDefined();
  expect(foundBox.getProductName()).toBe('사이다');
});

test('findPromotionBoxByName 메서드 - 이름으로 프로모션 박스 검색', () => {
  inventory.addBox(promotionBox);
  const foundPromotionBox = inventory.findPromotionBoxByName('사이다');

  expect(foundPromotionBox).toBeDefined();
  expect(foundPromotionBox.getProductName()).toBe('사이다');
});

test('getDetails 메서드 - 모든 박스의 상세 정보 가져오기', () => {
  inventory.addBox(productBox1);
  inventory.addBox(productBox2);
  inventory.addBox(promotionBox);

  const details = inventory.getDetails();
  expect(details).toEqual([productBox1.getDetails(), productBox2.getDetails(), promotionBox.getDetails()]);
});
