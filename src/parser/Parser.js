class Parser {
  static parseFileContentToObject(fileContent) {
    const rows = fileContent.trim().split('\n');
    const objectKeys = rows[0].split(',');

    return rows.slice(1).map((row) => Parser.#makeDataObject(row, objectKeys));
  }

  static #makeDataObject(row, objectKeys) {
    const objectValues = row.split(',');

    return objectKeys.reduce((dataObject, key, index) => {
      return { ...dataObject, [key]: objectValues[index] };
    }, {});
  }
}

export default Parser;
