const createUniqueProduct = function createUniqueProducts(productRecords) {
  return Array.from(
    new Map(
      productRecords.map(({ name, price }) => [name + price, { name, price: parseInt(price, 10) }]),
    ).values(),
  );
};

export default createUniqueProduct;
