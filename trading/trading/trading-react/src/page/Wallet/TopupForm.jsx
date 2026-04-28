import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { paymentHandler } from "../../State/Wallet/Action";

function TopupForm() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("JWT not found. Please login.");

    console.log("Submitting:", { amount, paymentMethod });

    dispatch(paymentHandler(jwt, paymentMethod, amount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div>
        <label className="text-sm block mb-1">Amount</label>
        <input
          name="amount"
          type="number"
          required
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter amount" />
      </div>

      <div>
        <Label className="text-sm block mb-2">Select Payment Method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="RAZORPAY" id="razorpay" />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png"
              alt="Razorpay"
              className="h-5" />
            <Label htmlFor="razorpay">Razorpay</Label>
          </div>

          <div className="flex items-center space-x-3">
            <RadioGroupItem value="STRIPE" id="stripe" />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/768px-Stripe_Logo%2C_revised_2016.svg.png"
              alt="Stripe"
              className="h-5" />
            <Label htmlFor="stripe">Stripe</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}

export default TopupForm;
