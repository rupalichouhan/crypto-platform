import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

function AssetTable({ coin = [], category = 'all' }) {
  const navigate = useNavigate();

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '$0.00';
    return '$' + new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '$0.00';
    if (price < 0.01) return '$' + Number(price).toFixed(6);
    return '$' + Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filter or sort by category
  let displayedCoins = [...coin];
  if (category === 'topGainers') {
    displayedCoins.sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0));
  } else if (category === 'topLosers') {
    displayedCoins.sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0));
  }

  if (!displayedCoins || displayedCoins.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        No coin data currently available. Loading live feeds...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40">
      <Table>
        <TableHeader className="bg-slate-900/90 border-b border-slate-800">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[180px] text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset</TableHead>
            <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Symbol</TableHead>
            <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Volume (24h)</TableHead>
            <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market Cap</TableHead>
            <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">24h Change</TableHead>
            <TableHead className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedCoins.map((item, index) => {
            const change = item.price_change_percentage_24h ?? 0;
            const isPositive = change >= 0;

            return (
              <TableRow
                key={item.id || index}
                onClick={() => navigate(`/market/${item.id}`)}
                className="group cursor-pointer hover:bg-slate-800/50 border-b border-slate-800/50 transition-colors"
              >
                {/* Coin Name & Logo */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700">
                      <AvatarImage src={item.image} alt={item.name} />
                    </Avatar>
                    <span className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </span>
                  </div>
                </TableCell>

                {/* Symbol */}
                <TableCell className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  {item.symbol}
                </TableCell>

                {/* Volume */}
                <TableCell className="text-xs text-slate-300 font-mono">
                  {formatNumber(item.total_volume)}
                </TableCell>

                {/* Market Cap */}
                <TableCell className="text-xs text-slate-300 font-mono">
                  {formatNumber(item.market_cap)}
                </TableCell>

                {/* 24h Change % */}
                <TableCell>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold font-mono ${
                    isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell className="text-right text-sm font-semibold font-mono text-slate-100">
                  {formatPrice(item.current_price)}
                </TableCell>

                {/* Quick Arrow */}
                <TableCell className="text-right pr-4">
                  <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400 transition-colors ml-auto" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default AssetTable;
