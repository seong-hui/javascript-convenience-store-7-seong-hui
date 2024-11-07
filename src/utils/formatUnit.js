const formatWithUnit = function addUnit(value, unit) {
  return `${value}${unit}`;
};

const formatPriceWithUnit = function formatPriceWithUnit(value) {
  const formatPrice = new Intl.NumberFormat('ko-KR').format(value);
  return formatWithUnit(formatPrice, '원');
};

export { formatPriceWithUnit, formatWithUnit };
