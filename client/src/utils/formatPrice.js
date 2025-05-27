// 1 230 000 zł
export function formatPricePLN(value) {
  const formattedValue = value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedValue;
}
