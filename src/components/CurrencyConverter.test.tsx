import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CurrencyConverter from './CurrencyConverter';
import * as hooks from '../hooks/useLatestExchangeRatesForCurrency';
import userEvent from '@testing-library/user-event';

const dataValues = {
  rates: {
    GBP: 0.85945,
  },
  base: 'EUR',
  date: '2021-03-16',
};

beforeEach(() => {
  jest.spyOn(hooks, 'default').mockImplementation((currency?: string) => ({
    data: { ...dataValues, base: currency },
    isLoading: false,
    isError: false,
    error: undefined,
  }));

  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <CurrencyConverter />
    </QueryClientProvider>,
  );
});

afterEach(() => {
  cleanup();
});

describe('CurrencyConverter component conversions', () => {
  beforeEach(() => {
    const [, targetSelect] = screen.getAllByRole('button');
    // Select target currency
    fireEvent.mouseDown(targetSelect);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/gbp/i));
  });

  test('should convert base currency to target currency', () => {
    // Input sourceValue
    const [sourceValueInput, targetValueInput] = screen.getAllByRole('textbox');

    const sourceValueUserValue = '1';
    const expectedTargetValue = (parseInt(sourceValueUserValue) * dataValues.rates.GBP).toFixed(2);
    userEvent.type(sourceValueInput, sourceValueUserValue);

    expect(targetValueInput).toHaveValue(expectedTargetValue);
  });

  test('should convert target currency to base currency', () => {
    // Input targetValue
    const [sourceValueInput, targetValueInput] = screen.getAllByRole('textbox');

    const targetValueUserTypedValue = '1';
    const expectedSourceValue = (parseInt(targetValueUserTypedValue) / dataValues.rates.GBP).toFixed(2);
    userEvent.type(targetValueInput, targetValueUserTypedValue);

    expect(sourceValueInput).toHaveValue(expectedSourceValue);
  });
});

test('CurrencyConverter component inputs disabled until currency selection', () => {
  const [sourceValueInput] = screen.getAllByRole('textbox');
  expect(sourceValueInput).toBeDisabled();
});
