import { useQuery } from 'react-query';
import CurrencyRates from 'src/models/CurrencyRates';
import fetchWithOptions from 'src/utils/fetchWithOptions';

const getLatestExchangeRates = (currency?: string) => fetchWithOptions(`/latest${currency ? `?base=${currency}` : ''}`);

const latestExchangeRatesQueryKey = (currency?: string) => ['latestExchange', currency];

const useLatestExchangeRatesForCurrency = (currency?: string) => {
  const { data, isLoading, isError, error } = useQuery<CurrencyRates>(latestExchangeRatesQueryKey(currency), () =>
    getLatestExchangeRates(currency),
  );

  return { data, isLoading, isError, error };
};

export default useLatestExchangeRatesForCurrency;
