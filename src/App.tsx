import CurrencyConverter from './components/CurrencyConverter';
// eslint-disable-next-line import/no-unresolved
import type {} from 'styled-components/cssprop';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Typography, Container } from '@material-ui/core';
import styled from 'styled-components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      // will not retry more than 2 times and 1.5 seconds so we don't have to keep user waiting
      retryDelay: (attemptIndex) => Math.min(400 * 2 ** attemptIndex, 1500),
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MainContainer maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        Gerald&apos;s Wonder Emporium of Conversions
      </Typography>
      <CurrencyConverter />
    </MainContainer>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

const MainContainer = styled(Container)`
  margin-top: 24px;
`;

export default App;
