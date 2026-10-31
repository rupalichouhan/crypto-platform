import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wallet as WalletIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat2,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawalForm from "./WithdrawalForm";
import { useDispatch, useSelector } from 'react-redux';
import { depositMoney, getUserWallet, getWalletTransactions } from '../../State/Wallet/Action';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Wallet() {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const orderId = query.get("order_id");
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsRefreshing(true);
      await Promise.all([
        dispatch(getUserWallet(jwt)),
        dispatch(getWalletTransactions(jwt)),
      ]);
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // Handle gateway redirects
  useEffect(() => {
    if (orderId) {
      dispatch(depositMoney({
        jwt: localStorage.getItem("jwt"),
        orderId,
        paymentId: razorpayPaymentId || paymentId,
        navigate
      }));
    }
  }, [orderId, paymentId, razorpayPaymentId, dispatch, navigate]);

  const balance = Number(wallet.userWallet?.balance || 0);
  const transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];

  // Filter transactions
  const filteredTransactions = transactions.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DEPOSIT") return item.type?.toLowerCase().includes("add") || item.type?.toLowerCase().includes("deposit");
    if (activeTab === "WITHDRAWAL") return item.type?.toLowerCase().includes("withdraw");
    if (activeTab === "TRANSFER") return item.type?.toLowerCase().includes("transfer");
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Wallet Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <WalletIcon className="h-6 w-6 text-orange-400" />
            Fiat & Ledger Wallet
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Wallet ID: <span className="font-mono text-slate-300">#{wallet.userWallet?.id || 'DEFAULT'}</span>
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          <span>Sync Balance</span>
        </button>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Cash Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Balance
          </p>
          <h2 className="text-3xl font-extrabold font-mono text-slate-100 mt-2">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="flex gap-2 mt-5">
            {/* Add Money Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]">
                  <ArrowDownToLine className="h-4 w-4" />
                  <span>Deposit</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-800 text-slate-100">
                <DialogHeader className="pb-3 border-b border-slate-800">
                  <DialogTitle className="text-base font-bold text-slate-100">
                    Add Funds to Wallet
                  </DialogTitle>
                </DialogHeader>
                <TopupForm />
              </DialogContent>
            </Dialog>

            {/* Withdraw Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-all">
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span>Withdraw</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-800 text-slate-100">
                <DialogHeader className="pb-3 border-b border-slate-800">
                  <DialogTitle className="text-base font-bold text-slate-100">
                    Request Withdrawal
                  </DialogTitle>
                </DialogHeader>
                <WithdrawalForm />
              </DialogContent>
            </Dialog>

            {/* Transfer Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-all" title="Transfer Funds">
                  <Repeat2 className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-800 text-slate-100">
                <DialogHeader className="pb-3 border-b border-slate-800">
                  <DialogTitle className="text-base font-bold text-slate-100">
                    Internal Wallet Transfer
                  </DialogTitle>
                </DialogHeader>
                <TransferForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Pending Processing
            </p>
            <h3 className="text-2xl font-bold font-mono text-slate-200 mt-2">
              $0.00
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Zero pending settlement locks. All trades execute instantly.
          </p>
        </div>

        {/* Security / Ledger Mode Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Ledger Protection
            </p>
            <h3 className="text-lg font-bold text-slate-200 mt-2">
              Pessimistic Concurrency Lock
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Strict BigDecimal scale 2 ledger with double-spend prevention.
          </p>
        </div>
      </div>

      {/* Transaction History Section with Tabs */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-200">
            Transaction Activity
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
            {["ALL", "DEPOSIT", "WITHDRAWAL", "TRANSFER"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-orange-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No transactions recorded for category: {activeTab.toLowerCase()}.
            </div>
          ) : (
            filteredTransactions.map((item, idx) => {
              const isDeposit = item.type?.toLowerCase().includes("add") || item.type?.toLowerCase().includes("deposit");
              const isWithdraw = item.type?.toLowerCase().includes("withdraw");

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/60 hover:border-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDeposit
                        ? "bg-emerald-500/10 text-emerald-400"
                        : isWithdraw
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {isDeposit ? (
                        <ArrowDownToLine className="h-4 w-4" />
                      ) : isWithdraw ? (
                        <ArrowUpFromLine className="h-4 w-4" />
                      ) : (
                        <Repeat2 className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {item.type || "Transaction"}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "Timestamp unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-bold font-mono ${
                      isDeposit ? "text-emerald-400" : isWithdraw ? "text-rose-400" : "text-slate-200"
                    }`}>
                      {isDeposit ? "+" : isWithdraw ? "-" : ""}${Number(item.amount || 0).toFixed(2)}
                    </p>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      Settled
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
