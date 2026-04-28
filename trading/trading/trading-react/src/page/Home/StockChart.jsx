import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketChart } from '../../State/Coin/Action';
import { useParams } from 'react-router-dom';

const timeSeries = [
  { label: '1 Day', value: 1 },
  { label: '1 Week', value: 7 },
  { label: '1 Month', value: 30 },
  { label: '1 Year', value: 365 },
];

function StockChart() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector(state => state.coin.marketChart);

  const [activeLabel, setActiveLabel] = useState('1 Day');
  const activeItem = timeSeries.find(item => item.label === activeLabel);

  useEffect(() => {
  if (id && activeItem) {
    dispatch(fetchMarketChart({ coinId: id, days: activeItem.value }));
  }
}, [dispatch, id, activeItem.value]);

  if (loading) return <p>Loading chart…</p>;
  if (error)   return <p className="text-red-500">Error: {error}</p>;

  const series = [{
    name: 'Price',
    data: data.map(([ts, price]) => ({ x: new Date(ts), y: price })),
  }];

  const options = {
    chart: { id: 'chart', type: 'area', zoom: { autoScaleYaxis: true } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: 'Price' } },
    tooltip: { x: { format: 'dd MMM yyyy HH:mm' } },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.8, opacityTo: 0.9 } },
    grid: { strokeDashArray: 4 },
  };

  return (
    <div>
      <div className="space-x-3 mb-4">
        {timeSeries.map(item => (
          <Button
            key={item.label}
            variant={item.label === activeLabel ? 'default' : 'outline'}
            onClick={() => setActiveLabel(item.label)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
}

export default StockChart;
