class Parser {
  static parseFileContentToRecords(fileContent) {
    const rows = fileContent.trim().split('\n');
    const Keys = rows[0].split(',');

    return rows.slice(1).map((row) => Parser.#makeRowToRecord(row, Keys));
  }

  static #makeRowToRecord(row, keys) {
    const rowValues = row.split(',');

    return keys.reduce((record, key, index) => {
      return { ...record, [key]: rowValues[index] };
    }, {});
  }
}

export default Parser;
