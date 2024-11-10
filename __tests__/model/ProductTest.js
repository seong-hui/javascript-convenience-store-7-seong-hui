import Product from '../../src/model/Product';

describe('Product 클래스 메서드 테스트', () => {
  let product;

  beforeEach(() => {
    product = new Product('사이다', 1000);
  });

  test('getDetails 메서드 - 상품이름과 가격 가져옴', () => {
    const details = product.getDetails();
    expect(details).toBe('사이다 1,000원');
  });

  test.each([
    ['일치하는 이름과 가격일 때', '사이다', '1000', true],
    ['일치하지 않는 이름일 때', '콜라', '1000', false],
    ['일치하지 않는 가격일 때', '사이다', '2000', false],
    ['일치하지 않는 이름, 가격일 때', '라면', '2000', false],
  ])('matchNameAndPrice 메서드 테스트 - %s', (_, name, price, expected) => {
    expect(product.matchNameAndPrice(name, price)).toBe(expected);
  });

  test.each([
    ['일치하는 이름', '사이다', true],
    ['일치하지 않는 이름', '콜라', false],
  ])('matchName 메서드 테스트 - %s', (_, name, expected) => {
    expect(product.matchName(name)).toBe(expected);
  });
});
