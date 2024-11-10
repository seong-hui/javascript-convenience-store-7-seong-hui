import Validator from '../validator/Validator.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

const Parser = {
  parseFileContentToRecords(fileContent) {
    const rows = fileContent.trim().split('\n');
    const Keys = rows[0].split(',');

    return rows.slice(1).map((row) => Parser.makeRowToRecord(row, Keys));
  },

  makeRowToRecord(row, keys) {
    const rowValues = row.split(',');

    return keys.reduce((record, key, index) => {
      return { ...record, [key]: rowValues[index] };
    }, {});
  },

  extractNameAndQuantity(item) {
    const itemRegex = /^\[([가-힣a-zA-Z0-9]+)-(\d+)\]$/;
    const [, name, quantity] = item.match(itemRegex);
    return { name, quantity: parseInt(quantity, 10) };
  },

  parseItemToRecords(inputItem) {
    const items = inputItem.split(',');

    return items.map((item) => {
      if (Validator.isValidItemFormat(item)) {
        return Parser.extractNameAndQuantity(item);
      }
      throw new Error(ERROR_MESSAGES.INVALID_INPUT_FORMAT);
    });
  },
};

export default Parser;
