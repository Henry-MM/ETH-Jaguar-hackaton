export const formatCustomCurrency = (
  amount: number, 
  currencyCode: string = "LPC", 
  symbol: string = "₱"
): string => {
  return `${symbol}${amount.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currencyCode}`;
};

export const banks = [
  { key: "Bac Credomatic", label: "Bac Credomatic" },
  { key: "Ficohsa", label: "Ficohsa" },
  { key: "Davivienda", label: "DaVivienda" },
  { key: "Atlantida", label: "Atlantida" },
  { key: "Lafise", label: "Lafise" },
];
