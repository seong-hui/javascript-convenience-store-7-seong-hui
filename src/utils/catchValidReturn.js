import OutputView from '../view/OutputView.js';

const catchParseReturn = async function catchValidReturn(readItem, parseItem) {
  while (true) {
    try {
      const userItem = await readItem();
      return parseItem(userItem);
    } catch (error) {
      OutputView.printError(error);
    }
  }
};

export default catchParseReturn;
