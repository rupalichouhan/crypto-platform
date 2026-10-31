import React, { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  Search,
  Wallet,
  TrendingUp,
  X,
  ExternalLink
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchCoin } from '../../State/Coin/Action';
import { getUserWallet } from '../../State/Wallet/Action';

function Navbar() {
  const auth = useSelector((store) => store.auth);
  const wallet = useSelector((store) => store.wallet);
  const coin = useSelector((store) => store.coin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchInputRef = useRef(null);

  // Auto-fetch wallet on mount or auth change
  useEffect(() => {
    const jwt = auth.jwt || localStorage.getItem('jwt');
    if (jwt && (!wallet.userWallet || wallet.userWallet.balance === undefined)) {
      dispatch(getUserWallet(jwt));
    }
  }, [auth.jwt, dispatch, wallet.userWallet]);

  // Debounced coin search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      dispatch(searchCoin(searchQuery.trim()));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const balance = Number(wallet.userWallet?.balance || 0);

  const handleSelectCoin = (coinId) => {
    setShowSearchModal(false);
    setSearchQuery('');
    navigate(`/market/${coinId}`);
  };

  return (
    <>
      <header className="px-4 lg:px-8 py-3 border-b border-slate-800/80 z-50 bg-slate-950/90 backdrop-blur-md sticky top-0 left-0 right-0 flex justify-between items-center transition-all duration-200">
        {/* Left Section: Menu trigger + Logo + Quick Search */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-10 w-10 hover:bg-slate-800 text-slate-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              className="w-72 bg-slate-950 border-r border-slate-800 p-0 flex flex-col justify-start"
              side="left"
            >
              <SheetHeader className="p-6 border-b border-slate-800/70">
                <SheetTitle>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <TrendingUp className="h-5 w-5 text-slate-950 font-black" />
                    </div>
                    <div className="flex flex-col text-left leading-none">
                      <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                        Zosh Trade
                      </span>
                      <span className="text-xs text-slate-400 mt-1 font-medium">
                        Crypto Exchange
                      </span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="p-4 flex-1 overflow-y-auto">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo Brand Title */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center group-hover:border-orange-500/60 transition-colors">
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-100 hidden sm:inline-block">
              Zosh <span className="text-orange-400">Trade</span>
            </span>
          </div>

          {/* Quick Search Trigger */}
          <div className="ml-3 hidden sm:block">
            <button
              onClick={() => {
                setShowSearchModal(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors duration-150 w-48 md:w-64"
            >
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Search coins (e.g. BTC, ETH)...</span>
              <kbd className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                /
              </kbd>
            </button>
          </div>
        </div>

        {/* Right Section: Balance Badge + Search icon (mobile) + User Avatar */}
        <div className="flex items-center gap-3">
          {/* Mobile search icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSearchModal(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className="sm:hidden text-slate-300 hover:bg-slate-800 h-9 w-9 rounded-lg"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Live Balance Badge */}
          <button
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all duration-150 group shadow-sm"
            title="Open Wallet"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex flex-col text-right leading-none">
              <span className="text-[10px] text-slate-400 font-medium group-hover:text-emerald-400/80 transition-colors">
                Available
              </span>
              <span className="text-xs font-semibold text-slate-100 font-mono">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            title="User Profile"
          >
            <Avatar className="h-9 w-9 border border-slate-700 bg-slate-800">
              <AvatarImage src={auth.user?.avatar} alt={auth.user?.fullName || "User"} />
              <AvatarFallback className="bg-orange-600 text-white font-semibold text-xs">
                {auth.user?.fullName?.[0]?.toUpperCase() || "ZT"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Global Interactive Coin Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800">
              <Search className="h-4 w-4 text-orange-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by coin name or symbol (e.g. Bitcoin, sol, bnb)..."
                className="w-full bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowSearchModal(false)}
                className="ml-2 text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results or Trending list */}
            <div className="max-h-80 overflow-y-auto p-2">
              {coin.loading ? (
                <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                  Searching market pairs...
                </div>
              ) : coin.searchCoinList?.length > 0 ? (
                <div className="space-y-1">
                  {coin.searchCoinList.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCoin(item.id)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.thumb ? (
                          <img src={item.thumb} alt={item.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            {item.symbol?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-100 leading-tight">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-slate-400 uppercase font-mono">
                            {item.symbol}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No coins found matching "{searchQuery}"
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  Type coin name (e.g. Bitcoin, Ethereum) to quick jump
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
