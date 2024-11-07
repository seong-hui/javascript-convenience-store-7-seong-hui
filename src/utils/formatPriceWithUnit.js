const formatPriceWithUnit = function formatPriceWithUnit(value) {
  const formatPrice = new Intl.NumberFormat('ko-KR').format(value);
  return `${formatPrice}원`;
};

export default formatPriceWithUnit;
