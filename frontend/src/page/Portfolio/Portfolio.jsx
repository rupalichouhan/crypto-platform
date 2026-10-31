import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "../../State/Asset/Action";
import PortfolioAllocationChart from "./PortfolioAllocationChart";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  ArrowUpRight,
  Layers,
  Sparkles
} from "lucide-react";

const Portfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { asset } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUserAssets({ jwt }));
    }
  }, [dispatch, jwt]);

  const userAssetsList = Array.isArray(asset?.userAssets)
    ? asset.userAssets
    : Array.isArray(asset)
    ? asset
    : [];

  // Financial calculations with weighted cost basis
  let totalCurrentValue = 0;
  let totalCostBasis = 0;

  userAssetsList.forEach((item) => {
    const qty = Number(item.quantity || 0);
    const buyPrice = Number(item.buyPrice || 0);
    const currentPrice = Number(item.coin?.currentPrice || buyPrice || 0);

    totalCurrentValue += (qty * currentPrice);
    totalCostBasis += (qty * buyPrice);
  });

  const netPnL = totalCurrentValue - totalCostBasis;
  const netPnLPercent = totalCostBasis > 0 ? (netPnL / totalCostBasis) * 100 : 0;
  const isNetPositive = netPnL >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Portfolio & Asset Holdings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time weighted cost basis and simulated return analysis
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Trade New Markets</span>
        </button>
      </div>

      {/* Top Portfolio Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-orange-400" />
            Total Holdings Value
          </p>
          <h3 className="text-2xl font-bold font-mono text-slate-100 mt-2">
            ${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            Invested Cost Basis
          </p>
          <h3 className="text-2xl font-bold font-mono text-slate-100 mt-2">
            ${totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            {isNetPositive ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
            Unrealized Return (P&L)
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className={`text-2xl font-bold font-mono ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isNetPositive ? '+' : ''}${netPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className={`text-xs font-bold font-mono ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({isNetPositive ? '+' : ''}{netPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <PieChart className="h-3.5 w-3.5 text-amber-400" />
            Active Crypto Assets
          </p>
          <h3 className="text-2xl font-bold font-mono text-slate-100 mt-2">
            {userAssetsList.length}
          </h3>
        </div>
      </div>

      {/* Grid: Allocation Donut Chart & Holdings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {userAssetsList.length > 0 && (
          <div className="lg:col-span-4">
            <PortfolioAllocationChart assets={userAssetsList} />
          </div>
        )}

        <div className={userAssetsList.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
              <h3 className="text-sm font-semibold text-slate-200">Asset Ledger</h3>
            </div>

            <Table>
              <TableHeader className="bg-slate-900/90 border-b border-slate-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Asset</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Avg Buy Price</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Current Price</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Quantity</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Holding Value</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase">Unrealized P&L</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-slate-400 uppercase">Trade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {userAssetsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <PieChart className="h-8 w-8 text-slate-600" />
                        <p className="text-sm font-medium">No assets in your portfolio yet</p>
                        <p className="text-xs text-slate-500">
                          Execute your first trade to build your crypto holdings.
                        </p>
                        <button
                          onClick={() => navigate('/')}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs"
                        >
                          Explore Markets
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  userAssetsList.map((item, index) => {
                    const coin = item.coin || {};
                    const coinId = coin.id || item.coinId;
                    const name = coin.name || item.name || "Asset";
                    const symbol = (coin.symbol || item.symbol || "").toUpperCase();
                    const qty = Number(item.quantity || 0);
                    const avgBuyPrice = Number(item.buyPrice || 0);
                    const currentPrice = Number(coin.currentPrice || avgBuyPrice);

                    const assetCost = qty * avgBuyPrice;
                    const currentValue = qty * currentPrice;
                    const pnl = currentValue - assetCost;
                    const pnlPct = assetCost > 0 ? (pnl / assetCost) * 100 : 0;
                    const isPos = pnl >= 0;

                    return (
                      <TableRow
                        key={item.id || index}
                        className="hover:bg-slate-800/40 border-b border-slate-800/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div
                            onClick={() => coinId && navigate(`/market/${coinId}`)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Avatar className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700">
                              <AvatarImage src={coin.image || item.image} alt={name} />
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                                {name}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {symbol}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs font-mono text-slate-300">
                          ${avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        <TableCell className="text-xs font-mono font-semibold text-slate-100">
                          ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        <TableCell className="text-xs font-mono text-slate-200">
                          {qty.toFixed(6)}
                        </TableCell>

                        <TableCell className="text-xs font-mono font-bold text-slate-100">
                          ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        <TableCell>
                          <div className={`inline-flex items-center gap-1 text-xs font-mono font-bold ${
                            isPos ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isPos ? '+' : ''}${pnl.toFixed(2)}
                            <span className="text-[10px]">({isPos ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <button
                            onClick={() => coinId && navigate(`/market/${coinId}`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-300 transition-colors inline-flex items-center gap-1 text-xs font-medium"
                            title="Trade"
                          >
                            <span>Trade</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
