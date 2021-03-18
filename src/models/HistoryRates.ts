interface HistoryRates {
  rates: {
    [key: string]: {
      [key: string]: number;
    };
  };
  start_at: string;
  end_at: string;
  base: string;
}

export default HistoryRates;
