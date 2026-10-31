import React from "react";
import ReactApexChart from "react-apexcharts";

function PortfolioAllocationChart({ assets = [] }) {
  if (!assets || assets.length === 0) {
    return null;
  }

  const labels = assets.map((item) => item.coin?.name || item.name || "Unknown");
  const series = assets.map((item) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.coin?.currentPrice || item.buyPrice || 0);
    return Number((qty * price).toFixed(2));
  });

  const totalValue = series.reduce((sum, val) => sum + val, 0);

  if (totalValue <= 0) {
    return null;
  }

  const options = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels,
    colors: ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
    stroke: {
      show: true,
      colors: ["#090d16"],
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#94a3b8",
      },
      fontFamily: "inherit",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              color: "#94a3b8",
              fontSize: "12px",
            },
            value: {
              show: true,
              color: "#f8fafc",
              fontSize: "16px",
              fontWeight: "bold",
              formatter: (val) => `$${Number(val).toLocaleString()}`,
            },
            total: {
              show: true,
              label: "Portfolio",
              color: "#94a3b8",
              formatter: () => `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            },
          },
        },
      },
    },
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Asset Distribution</h3>
      <div className="w-full flex items-center justify-center">
        <ReactApexChart options={options} series={series} type="donut" height={280} width="100%" />
      </div>
    </div>
  );
}

export default PortfolioAllocationChart;
