const formatProductLine = function formatProductLine(product, orderQuantity, price) {
  if (product.length > 3) return `${product}\t\t${orderQuantity}\t${price.toLocaleString()}`;
  return `${product}\t\t\t${orderQuantity}\t${price.toLocaleString()}`;
};

const formatPromotionLine = function formatPromotionLine(product, promotionQuantity) {
  if (product.length > 3) return `${product}\t\t${promotionQuantity}`;
  return `${product}\t\t\t${promotionQuantity}`;
};

export { formatProductLine, formatPromotionLine };
