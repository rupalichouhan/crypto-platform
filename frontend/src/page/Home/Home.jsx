import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import AssetTable from './AssetTable';
import StockChart from './StockChart';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Sparkles,
  MessageCircleCode,
  X,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoinList, getTop50CoinList } from '../../State/Coin/Action';
import { useNavigate } from 'react-router-dom';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const categoryOptions = [
  { label: 'All Pairs', value: 'all' },
  { label: 'Top 50', value: 'top50' },
  { label: 'Top Gainers', value: 'topGainers' },
  { label: 'Top Losers', value: 'topLosers' },
];

function Home() {
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null);
  const { coin, wallet } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategory = (value) => {
    setCategory(value);
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    const query = userInput.trim().toLowerCase();
    let botReply = `I'm your Zosh Trade AI assistant. You asked: "${userInput}".`;
    if (query.includes('bitcoin') || query.includes('btc')) {
      botReply = "Bitcoin (BTC) is the premier cryptocurrency with the highest liquidity and market dominance. Check out the live chart on your right!";
    } else if (query.includes('deposit') || query.includes('fund')) {
      botReply = "You can fund your account simulated ledger by clicking the 'Deposit' button in the top ribbon or navigating to the Wallet page.";
    } else if (query.includes('fee')) {
      botReply = "Zosh Trade charges a competitive 0.1% platform fee per trade, calculated directly in high precision BigDecimal.";
    }

    const newMessages = [
      ...chatMessages,
      { type: 'user', text: userInput },
      { type: 'bot', text: botReply },
    ];

    setChatMessages(newMessages);
    setUserInput('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (category === 'top50') {
      dispatch(getTop50CoinList());
    } else {
      dispatch(getCoinList(currentPage));
    }
  }, [category, currentPage, dispatch]);

  const balance = Number(wallet.userWallet?.balance || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-6">
      {/* Top Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cash Balance */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Available Trading Cash</p>
            <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <button
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 transition-colors"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Deposit</span>
          </button>
        </div>

        {/* Metric 2: Platform Status */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Trading Mode</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-semibold text-emerald-400">Simulated / High Precision</h3>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

        {/* Metric 3: Platform Fee */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Trading Fee</p>
            <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">0.10%</h3>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
        </div>

        {/* Metric 4: Market Trend */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Market Health</p>
            <h3 className="text-sm font-semibold text-slate-200 mt-1">Real-Time Crypto Index</h3>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Markets (Left) & Live Chart / BTC Spotlight (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Market Pairs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <div className="flex flex-wrap items-center gap-2">
              {categoryOptions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleCategory(item.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    category === item.value
                      ? 'bg-orange-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Showing {category === 'top50' ? 'Top 50 Coins' : 'Page ' + currentPage}
            </span>
          </div>

          {/* Asset Table */}
          <AssetTable
            coin={category === 'top50' ? coin?.top50 || [] : coin?.coinList || []}
            category={category}
          />

          {/* Pagination */}
          {category !== 'top50' && (
            <div className="py-2">
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-xs text-slate-400 px-3 py-1 font-mono">
                      Page {currentPage}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    >
                      Next
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Right Section: Interactive Chart & Benchmark Spotlight */}
        <div className="lg:col-span-5 space-y-4">
          <StockChart coinId="bitcoin" />

          {/* Benchmark Bitcoin Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-amber-500/30">
                <AvatarImage
                  src="https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png"
                  alt="Bitcoin"
                />
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">Bitcoin</span>
                  <span className="text-xs font-mono uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">
                    BTC
                  </span>
                </div>
                <p className="text-xs text-slate-400">Benchmark Cryptocurrency</p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/market/bitcoin')}
              variant="outline"
              size="sm"
              className="text-xs border-slate-700 hover:border-orange-500 hover:text-orange-400"
            >
              <span>View Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Assistant */}
      <aside className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {showChat && (
          <div className="mb-3 w-[22rem] sm:w-[26rem] h-[28rem] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 leading-none">Trade Assistant</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 text-xs"
            >
              <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl max-w-[85%] text-slate-300">
                Hello! I am your Zosh Trade assistant. Ask me anything about coins, trading fees, or portfolio allocation.
              </div>

              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[85%] ${
                      msg.type === 'user'
                        ? 'bg-orange-500 text-slate-950 font-medium'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about crypto prices, fees, orders..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-orange-500"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!userInput.trim()}
                className="p-2 rounded-xl bg-orange-500 text-slate-950 hover:bg-orange-600 disabled:opacity-40 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-orange-500/20 hover:scale-105 transition-all duration-150"
        >
          <MessageCircleCode className="h-4 w-4" />
          <span>AI Assistant</span>
        </button>
      </aside>
    </div>
  );
}

export default Home;
