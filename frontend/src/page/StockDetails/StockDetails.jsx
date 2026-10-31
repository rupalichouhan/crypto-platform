import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Activity,
  Layers,
  BarChart2
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TradingForm from "./Tradingform";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCoinDetails } from "../../State/Coin/Action";
import { addItemToWatchlist, getUserWatchlist } from "../../State/Watchlist/Action";
import { existInWatchlist } from "../../Utils/existInWatchlist";

function StockDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coin, watchlist } = useSelector((store) => store);
  const details = coin?.coinDetails;
  const [message, setMessage] = useState("");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (id && jwt) {
      dispatch(fetchCoinDetails({ coinId: id, jwt }));
      dispatch(getUserWatchlist({ jwt }));
    }
  }, [id, jwt, dispatch]);

  const handleAddToWatchlist = async () => {
    try {
      dispatch(addItemToWatchlist({ coinId: id, jwt }));
      setMessage("Watchlist updated successfully");
    } catch {
      setMessage("Failed to update watchlist");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!details || coin.loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading coin details and market parameters...</p>
      </div>
    );
  }

  const { name, symbol, image, market_data: marketData } = details;
  const currentPrice = marketData?.current_price?.usd ?? 0;
  const priceChange24h = marketData?.price_change_24h ?? 0;
  const priceChangePercent24h = marketData?.price_change_percentage_24h ?? 0;
  const isPositive = priceChangePercent24h >= 0;

  const low24h = marketData?.low_24h?.usd ?? (currentPrice * 0.95);
  const high24h = marketData?.high_24h?.usd ?? (currentPrice * 1.05);
  const rangePercent = high24h > low24h
    ? Math.min(100, Math.max(0, ((currentPrice - low24h) / (high24h - low24h)) * 100))
    : 50;

  const inWatchlist = existInWatchlist(watchlist?.items, details);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top back button & notification */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Markets</span>
        </button>

        {message && (
          <div className="px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-medium animate-in fade-in">
            {message}
          </div>
        )}
      </div>

      {/* Main Asset Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border border-slate-700 bg-slate-800 shadow-md">
            <AvatarImage src={image?.large} alt={name} />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">{name}</h1>
              <span className="text-xs font-mono font-bold uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                {symbol}
              </span>
              <span className="text-[11px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md">
                Rank #{marketData?.market_cap_rank ?? '-'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-3xl font-extrabold font-mono text-slate-100">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </span>
              <div className={`inline-flex items-center gap-1 text-sm font-semibold font-mono ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{isPositive ? '+' : ''}{priceChangePercent24h.toFixed(2)}%</span>
                <span className="text-xs text-slate-400">
                  (${Math.abs(priceChange24h).toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Watchlist & Quick Trade Dialog */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToWatchlist}
            className={`p-3 rounded-xl border transition-all ${
              inWatchlist
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-100'
            }`}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
                Quick Trade
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-800 text-slate-100 p-0 overflow-hidden">
              <DialogHeader className="p-6 border-b border-slate-800 bg-slate-900/60">
                <DialogTitle className="text-base font-bold text-slate-100">
                  Instant Trade Ticket: {name} ({symbol?.toUpperCase()})
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <TradingForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 24h Price Range Slider Ribbon */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>24h Low: ${low24h.toLocaleString()}</span>
          <span className="text-slate-200 font-semibold">24h Price Range</span>
          <span>24h High: ${high24h.toLocaleString()}</span>
        </div>
        <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
            style={{ width: `${rangePercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Time-series Chart */}
      <div className="w-full">
        <StockChart coinId={id} />
      </div>

      {/* Key Market Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <BarChart2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Market Cap</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-100">
            ${(marketData?.market_cap?.usd ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>24h Trading Volume</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-100">
            ${(marketData?.total_volume?.usd ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Circulating Supply</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-100">
            {(marketData?.circulating_supply ?? 0).toLocaleString()} {symbol?.toUpperCase()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span>All-Time High</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-100">
            ${(marketData?.ath?.usd ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;
