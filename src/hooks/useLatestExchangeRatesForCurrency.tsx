import { useQuery } from 'react-query';
import fetchWithOptions from 'src/utils/fetchWithOptions';

const getLatestExchangeRates = (currency?: string) => fetchWithOptions(`/latest${currency ? `?base=${currency}` : ''}`);

const latestExchangeRatesQueryKey = (currency?: string) => ['latestExchange', currency];

const useLatestExchangeRatesForCurrency = (currency?: string) => {
  console.log({ currency });
  const { data, isLoading, isError, error } = useQuery(latestExchangeRatesQueryKey(currency), () =>
    getLatestExchangeRates(),
  );

  return { data, isLoading, isError, error };
};

export default useLatestExchangeRatesForCurrency;
