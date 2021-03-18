import { subDays, format } from 'date-fns';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CircularProgress from '@material-ui/core/CircularProgress';
import useHistoricRatesForCurrency from 'src/hooks/useHistoricRatesForCurrency';

interface CurrencyRatesGraphProps {
  baseCurrency: string;
  targetCurrency: string;
}

const dateFormat = 'yyyy-MM-dd';

const CurrencyRatesGraph = ({ baseCurrency, targetCurrency }: CurrencyRatesGraphProps) => {
  const today = new Date();
  const { data, isError, isLoading } = useHistoricRatesForCurrency({
    currency: baseCurrency,
    targetCurrency,
    startAt: format(subDays(today, 30), dateFormat),
    endAt: format(today, dateFormat),
  });
  const chartData: Array<Array<number>> = [];

  if (data) {
    // Convert conversions into usable chart data
    for (const [key, value] of Object.entries(data.rates)) {
      const convertedDate = new Date(key);
      chartData.push([convertedDate.getTime(), value[targetCurrency]]);
    }
    chartData.sort((x, y) => x[0] - y[0]);
  }

  const options: Highcharts.Options = {
    title: {
      text: 'Last 30 days of rates',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
      },
    },
    yAxis: {
      title: {
        text: `${baseCurrency} to ${targetCurrency}`,
      },
    },
    series: [
      {
        type: 'line',
        data: chartData,
      },
    ],
    legend: {
      enabled: false,
    },
  };

  if (isLoading) {
    return <CircularProgress />;
  } else if (isError) {
    return <div>An error has occured</div>;
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default CurrencyRatesGraph;
