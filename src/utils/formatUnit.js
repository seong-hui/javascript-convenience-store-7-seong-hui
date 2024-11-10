import { UNIT } from '../constants/constants.js';

const formatWithUnit = function addUnit(value, unit) {
  return `${value}${unit}`;
};

const formatPriceWithUnit = function formatPriceWithUnit(value) {
  const formatPrice = value.toLocaleString();
  return formatWithUnit(formatPrice, UNIT.WON);
};

export { formatPriceWithUnit, formatWithUnit };
