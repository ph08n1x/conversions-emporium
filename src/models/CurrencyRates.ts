interface CurrencyRates {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

export default CurrencyRates;
