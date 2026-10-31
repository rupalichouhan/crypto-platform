import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserWallet } from "../../State/Wallet/Action";
import { getAssetDetails, getUserAssets } from "../../State/Asset/Action";
import { payOrder } from "../../State/Order/Action";
import { Wallet, ShieldAlert, CheckCircle2, ArrowRightLeft } from "lucide-react";

function TradingForm() {
  const [orderType, setOrderType] = useState("BUY");
  const [amountInput, setAmountInput] = useState("");
  const [quantity, setQuantity] = useState("");
  const [feedback, setFeedback] = useState({ type: null, text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { coin, wallet, asset, order } = useSelector((store) => store);

  const coinDetails = coin?.coinDetails;
  const coinId = coinDetails?.id;
  const name = coinDetails?.name || "Unknown";
  const symbol = coinDetails?.symbol?.toUpperCase() || "---";
  const price = coinDetails?.market_data?.current_price?.usd || 0;
  const imageUrl = coinDetails?.image?.large || "https://via.placeholder.com/40";

  const walletBalance = Number(wallet?.userWallet?.balance || 0);
  const assetQuantity = Number(asset?.assetDetails?.quantity || 0);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt && coinId) {
      dispatch(getUserWallet(jwt));
      dispatch(getAssetDetails({ coinId, jwt }));
    }
  }, [dispatch, jwt, coinId]);

  // Handle amount or quantity change
  const handleAmountChange = (val) => {
    setAmountInput(val);
    const num = parseFloat(val);
    if (!num || price === 0) {
      setQuantity("");
      return;
    }

    if (orderType === "BUY") {
      const calcQty = num / price;
      setQuantity(calcQty.toFixed(6));
    } else {
      // Selling: val is amount in USD, calculate required quantity
      const calcQty = num / price;
      setQuantity(calcQty.toFixed(6));
    }
  };

  const handlePreset = (percent) => {
    if (orderType === "BUY") {
      const available = walletBalance;
      const targetAmount = (available * (percent / 100));
      // Leave slight room for 0.1% platform fee if 100%
      const safeAmount = percent === 100 ? (targetAmount / 1.001) : targetAmount;
      const rounded = Number(safeAmount.toFixed(2));
      handleAmountChange(rounded.toString());
    } else {
      const targetQty = (assetQuantity * (percent / 100));
      const targetAmount = (targetQty * price);
      setAmountInput(targetAmount.toFixed(2));
      setQuantity(targetQty.toFixed(6));
    }
  };

  const estimatedFee = (parseFloat(amountInput) || 0) * 0.001;
  const totalCost = (parseFloat(amountInput) || 0) + estimatedFee;

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amountInput);
    const numericQty = parseFloat(quantity);

    if (!numericAmount || numericAmount <= 0 || !numericQty || numericQty <= 0) {
      setFeedback({ type: "error", text: "Please enter a valid amount." });
      return;
    }

    if (orderType === "BUY" && totalCost > walletBalance) {
      setFeedback({ type: "error", text: "Insufficient wallet balance (including 0.1% fee)." });
      return;
    }

    if (orderType === "SELL" && numericQty > assetQuantity) {
      setFeedback({ type: "error", text: "Insufficient asset quantity to sell." });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: null, text: "" });

    try {
      const orderPayload = {
        coinId,
        quantity: numericQty,
        orderType,
      };

      await dispatch(payOrder(jwt, orderPayload, numericAmount));

      setFeedback({
        type: "success",
        text: `${orderType} order for ${numericQty.toFixed(6)} ${symbol} executed successfully!`,
      });

      // Reset fields & refresh wallet
      setAmountInput("");
      setQuantity("");
      setTimeout(() => {
        dispatch(getUserWallet(jwt));
        dispatch(getAssetDetails({ coinId, jwt }));
        dispatch(getUserAssets(jwt));
      }, 500);

    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Order execution failed. Please verify ledger balance.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Order Type Toggle: BUY vs SELL */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setOrderType("BUY");
            setAmountInput("");
            setQuantity("");
            setFeedback({ type: null, text: "" });
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            orderType === "BUY"
              ? "bg-emerald-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          BUY {symbol}
        </button>
        <button
          type="button"
          onClick={() => {
            setOrderType("SELL");
            setAmountInput("");
            setQuantity("");
            setFeedback({ type: null, text: "" });
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            orderType === "SELL"
              ? "bg-rose-500 text-white shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          SELL {symbol}
        </button>
      </div>

      {/* Available Balance Ribbon */}
      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-slate-500" />
          {orderType === "BUY" ? "Available Cash" : "Holding Quantity"}
        </span>
        <span className="font-mono font-bold text-slate-200">
          {orderType === "BUY"
            ? `$${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : `${assetQuantity.toFixed(6)} ${symbol}`}
        </span>
      </div>

      {/* Amount Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400">Order Amount (USD)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">$</span>
          <Input
            type="number"
            placeholder="0.00"
            value={amountInput}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="pl-8 bg-slate-900 border-slate-800 font-mono text-slate-100 placeholder:text-slate-600 focus:border-orange-500 h-11"
          />
        </div>
      </div>

      {/* Allocation Presets: 25%, 50%, 75%, 100% */}
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => handlePreset(pct)}
            className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors"
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Quantity & Fee Calculation Breakdown */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Est. Quantity</span>
          <span className="font-mono font-bold text-slate-200">
            {quantity || "0.000000"} {symbol}
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Platform Fee (0.10%)</span>
          <span className="font-mono text-slate-300">
            ${estimatedFee.toFixed(4)}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-800/80 pt-2 font-semibold">
          <span className="text-slate-300">Total Settlement</span>
          <span className="font-mono text-orange-400">
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Execution Feedback / Error / Success Message */}
      {feedback.text && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          feedback.type === "success"
            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            : "bg-rose-500/15 border border-rose-500/30 text-rose-300"
        }`}>
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Order Execution Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !amountInput || parseFloat(amountInput) <= 0}
        className={`w-full h-11 text-sm font-bold shadow-md transition-all ${
          orderType === "BUY"
            ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/10"
            : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10"
        } disabled:opacity-40`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Executing Order...
          </span>
        ) : (
          `${orderType} ${symbol}`
        )}
      </Button>
    </div>
  );
}

export default TradingForm;
