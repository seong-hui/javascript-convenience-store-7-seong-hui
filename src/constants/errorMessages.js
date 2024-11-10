const ERROR_MESSAGES = Object.freeze({
  INVALID_INPUT_FORMAT: '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  NON_EXIST_PRODUCT: '존재하지 않는 상품입니다. 다시 입력해 주세요.',
  INVALID_QUANTITY: '잘못된 수량입니다. 다시 입력해 주세요.',
  OVER_STOCK_QUANTITY: '재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  FAILED_READ_FILE: (absolutePath) => `${absolutePath} 경로의 파일 읽기를 실패 하였습니다.`,
  INVALID_ANSWER: 'Y 또는 N로만 답변 가능합니다. 다시 입력해 주세요.',
});

const ERROR_LABEL = Object.freeze('[ERROR]');

export { ERROR_MESSAGES, ERROR_LABEL };
