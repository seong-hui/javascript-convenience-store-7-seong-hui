const Validator = {
  isValidItemFormat(item) {
    const itemRegex = /^\[([가-힣a-zA-Z0-9]+)-(\d+)\]$/;
    return itemRegex.test(item);
  },
};

export default Validator;
