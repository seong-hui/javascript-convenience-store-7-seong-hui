const RECEIPT_TEMPLATE = Object.freeze({
  RECEIPT_HEADER: '\n==============W 편의점================',
  ORDER_SUMMARY_HEADER: '상품명\t\t\t수량\t금액',
  PROMOTION_DIVIDER: '============증\t\t정============',
  RECEIPT_DIVIDER: '======================================',
});

const RECEIPT_LABELS = Object.freeze({
  TOTAL_PRICE: '총구매액',
  TOTAL_DISCOUNT: '행사할인',
  MEMBERSHIP_DISCOUNT: '멤버십할인',
  TOTAL_DUE: '내실돈',
});

export { RECEIPT_TEMPLATE, RECEIPT_LABELS };
