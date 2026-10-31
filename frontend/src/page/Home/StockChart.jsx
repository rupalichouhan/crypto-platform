import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketChart } from '../../State/Coin/Action';
import { useParams } from 'react-router-dom';

const timeSeries = [
  { label: '24H', value: 1 },
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '1Y', value: 365 },
];

function StockChart({ coinId: propCoinId }) {
  const { id: paramId } = useParams();
  const targetCoinId = propCoinId || paramId || 'bitcoin';
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.coin.marketChart || {});

  const [activeDays, setActiveDays] = useState(1);

  useEffect(() => {
    if (targetCoinId) {
      dispatch(fetchMarketChart({ coinId: targetCoinId, days: activeDays }));
    }
  }, [dispatch, targetCoinId, activeDays]);

  const series = [
    {
      name: 'Price (USD)',
      data: Array.isArray(data)
        ? data.map(([ts, price]) => ({
            x: new Date(ts).getTime(),
            y: typeof price === 'number' ? Number(price.toFixed(2)) : 0,
          }))
        : [],
    },
  ];

  const options = {
    chart: {
      id: 'crypto-market-chart',
      type: 'area',
      height: 380,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
      },
    },
    colors: ['#f97316'],
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#fb923c'],
        inverseColors: false,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 95, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'inherit',
        },
        datetimeUTC: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'inherit',
        },
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy, HH:mm',
      },
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-400">Market Price Action</h3>
          <p className="text-xs text-slate-500">Live time-series analysis</p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
          {timeSeries.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveDays(item.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                item.value === activeDays
                  ? 'bg-orange-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-[340px] flex flex-col items-center justify-center gap-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Streaming market series...</span>
        </div>
      ) : error ? (
        <div className="h-[340px] flex items-center justify-center text-xs text-rose-400">
          Unable to fetch real-time chart: {error}
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <ReactApexChart options={options} series={series} type="area" height={340} />
        </div>
      )}
    </div>
  );
}

export default StockChart;
