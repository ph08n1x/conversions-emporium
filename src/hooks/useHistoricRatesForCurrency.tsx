import { useQuery } from 'react-query';
import HistoryRates from 'src/models/HistoryRates';
import HistoryRatesSearch from 'src/models/HistoryRatesSearch';
import fetchWithOptions from 'src/utils/fetchWithOptions';

const getHistoricRatesForCurrency = ({ currency, targetCurrency, startAt, endAt }: HistoryRatesSearch) =>
  fetchWithOptions(`/history?base=${currency}&start_at=${startAt}&end_at=${endAt}&symbols=${targetCurrency}`);

const historicRatesForCurrencyQueryKey = ({ ...args }: HistoryRatesSearch) => [
  'latestExchange',
  ...Object.values(args),
];

const useHistoricRatesForCurrency = ({ ...args }: HistoryRatesSearch) => {
  const { data, isLoading, isError, error } = useQuery<HistoryRates>(
    historicRatesForCurrencyQueryKey({ ...args }),
    () => getHistoricRatesForCurrency({ ...args }),
  );

  return { data, isLoading, isError, error };
};

export default useHistoricRatesForCurrency;
