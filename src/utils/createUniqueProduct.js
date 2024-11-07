const createUniqueProduct = function createUniqueProducts(productRecords) {
  return Array.from(
    new Map(productRecords.map(({ name, price }) => [name + price, { name, price }])).values(),
  );
};

export default createUniqueProduct;
