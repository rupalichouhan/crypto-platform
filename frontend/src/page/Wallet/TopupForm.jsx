import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { paymentHandler } from "../../State/Wallet/Action";
import { DollarSign, ShieldCheck } from "lucide-react";

const quickAmounts = [50, 100, 500, 1000];

function TopupForm() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("Authentication token missing. Please sign in.");

    setLoading(true);
    try {
      await dispatch(paymentHandler(jwt, paymentMethod, amount));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-slate-100">
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
          Deposit Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
          <input
            name="amount"
            type="number"
            required
            min="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-slate-100 placeholder:text-slate-600 focus:border-orange-500 outline-none"
            placeholder="Min. $10"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset.toString())}
            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              amount === preset.toString()
                ? "bg-orange-500 text-slate-950 border-orange-500 font-bold shadow"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            +${preset}
          </button>
        ))}
      </div>

      {/* Payment Gateway Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-300 block">
          Select Payment Gateway
        </Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid grid-cols-2 gap-3"
        >
          <label
            htmlFor="razorpay"
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === "RAZORPAY"
                ? "bg-orange-500/10 border-orange-500/60 text-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <RadioGroupItem value="RAZORPAY" id="razorpay" className="border-slate-500 text-orange-500" />
            <span className="text-xs font-bold font-mono">Razorpay (INR / Card)</span>
          </label>

          <label
            htmlFor="stripe"
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === "STRIPE"
                ? "bg-orange-500/10 border-orange-500/60 text-slate-100"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <RadioGroupItem value="STRIPE" id="stripe" className="border-slate-500 text-orange-500" />
            <span className="text-xs font-bold font-mono">Stripe (USD Global)</span>
          </label>
        </RadioGroup>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Transactions are processed securely via SSL encryption into your demo ledger.</span>
      </div>

      <Button
        type="submit"
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-sm shadow-md transition-all"
      >
        {loading ? "Initializing Gateway..." : `Proceed to Pay $${amount || "0"}`}
      </Button>
    </form>
  );
}

export default TopupForm;
