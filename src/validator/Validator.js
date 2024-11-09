const Validator = {
  isValidItemFormat(item) {
    const itemRegex = /^\[([가-힣a-zA-Z0-9]+)-(\d+)\]$/;
    return itemRegex.test(item);
  },

  checkValidQuantity(quantity) {
    if (quantity < 1 || quantity > Number.MAX_SAFE_INTEGER) {
      throw new Error('잘못된 수량입니다. 다시 입력해 주세요.');
    }
  },
  checkStockAvailable(availableQuantity, quantity) {
    if (availableQuantity < quantity) throw new Error('재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
  },
};

export default Validator;
