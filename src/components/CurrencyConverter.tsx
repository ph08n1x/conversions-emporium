import styled from 'styled-components';
import { Typography, InputLabel, Select, MenuItem, TextField, CircularProgress, FormControl } from '@material-ui/core';
import { useState } from 'react';
import useLatestExchangeRatesForCurrency from 'src/hooks/useLatestExchangeRatesForCurrency';
import validations from 'src/utils/validation';
import CurrencyRatesGraph from './CurrencyRatesGraph';
import alphabeticallyOrderArray from 'src/utils/alpheticallyOrderArray';

interface ConvertedValues {
  source?: string | number;
  target?: string | number;
}

interface FormErrors {
  source?: string;
  target?: string;
}

type ChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

const CurrencyConverter = () => {
  // Setup states
  const [sourceCurrency, setSourceCurrency] = useState<string>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<string>('');
  const [convertedValues, setConvertedValues] = useState<ConvertedValues>({ source: '', target: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>();
  // Setup initial currency versions for default EUR
  const { data, isLoading, error: dataError } = useLatestExchangeRatesForCurrency(sourceCurrency);

  const currencies = [sourceCurrency, ...Object.keys(data?.rates ?? [])];
  const alphabeticallyOrderedCurr = alphabeticallyOrderArray(currencies);

  const handleSourceCurrencyChange = (e: ChangeEvent) => {
    setSourceCurrency(e.target.value as string);
  };

  const handleTargetCurrencyChange = (e: ChangeEvent) => {
    setTargetCurrency(e.target.value as string);
  };

  const onSourceTextChange = (e: ChangeEvent) => {
    const sourceString = e.target.value as string;
    validateNumberField(sourceString, 'source');

    const sourceValue = parseInt(sourceString);

    setConvertedValues({
      source: sourceString,
      target:
        !isNaN(sourceValue) && data?.rates[targetCurrency]
          ? (data?.rates[targetCurrency] * sourceValue).toFixed(2)
          : undefined,
    });
  };

  const onTargetTextChange = (e: ChangeEvent) => {
    const targetString = e.target.value as string;
    validateNumberField(targetString, 'target');

    const targetValue = parseInt(targetString);
    setConvertedValues({
      target: targetString,
      source:
        !isNaN(targetValue) && data?.rates[targetCurrency]
          ? (targetValue / data?.rates[targetCurrency]).toFixed(2)
          : undefined,
    });
  };

  // Checks if field has a valid number entered
  const validateNumberField = (aValue: string, fieldName: 'source' | 'target') => {
    if (!aValue.match(validations.number.pattern.value)) {
      setFormErrors({ ...formErrors, [fieldName]: validations.number.pattern.message });
    } else {
      setFormErrors({ ...formErrors, [fieldName]: undefined });
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  } else if (dataError) {
    return <div>An error has occured</div>;
  }

  return (
    <Container>
      <IntroText variant="body1" align="center">
        Please first select a source and target currency and then you get converting. You can also convert in either
        direction too!
      </IntroText>
      <form autoComplete="off">
        <Row>
          <Col>
            <FormControl>
              <InputLabel shrink id="source-currency-label">
                From
              </InputLabel>
              <Select labelId="source-currency-label" value={sourceCurrency} onChange={handleSourceCurrencyChange}>
                {alphabeticallyOrderedCurr.map((curr, i) => (
                  <MenuItem key={`source-choice-${curr}-${i}`} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <AlignedTextField
              value={convertedValues?.source}
              onChange={onSourceTextChange}
              label="Enter a value"
              helperText={formErrors?.source ?? null}
              error={formErrors?.source ? true : false}
              disabled={!sourceCurrency || !targetCurrency}
            />
          </Col>
          <Col>
            <FormControl>
              <InputLabel shrink id="target-currency-label">
                To
              </InputLabel>
              <Select
                labelId="target-currency-label"
                value={targetCurrency}
                onChange={handleTargetCurrencyChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Select a currency</em>
                </MenuItem>
                {alphabeticallyOrderedCurr.map((curr, i) => (
                  <MenuItem key={`target-choice-${curr}-${i}`} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <AlignedTextField
              value={convertedValues?.target}
              label=" "
              onChange={onTargetTextChange}
              helperText={formErrors?.target ?? null}
              error={formErrors?.target ? true : false}
              disabled={!sourceCurrency || !targetCurrency}
            />
          </Col>
        </Row>
      </form>
      {sourceCurrency && targetCurrency && (
        <CurrencyRatesGraph baseCurrency={sourceCurrency} targetCurrency={targetCurrency} />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 460px;
  margin: 0 auto;
  margin-top: 24px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  height: 150px;
  justify-content: space-between;
`;

const AlignedTextField = styled(TextField)`
  min-height: 70px;
`;

const IntroText = styled(Typography)`
  && {
    margin-bottom: 32px;
  }
`;

export default CurrencyConverter;
