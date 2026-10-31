import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BanknoteIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest } from "../../State/Withdrawal/Action";

const WithdrawalForm = ({ bankDetails }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("jwt");
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    if (
      !bankDetails?.bankName ||
      !bankDetails?.accountNumber ||
      !bankDetails?.ifsc
    ) {
      alert("Bank details are missing. Please add your payment information.");
      return;
    }

    dispatch(withdrawalRequest(Number(amount), jwt));
    setAmount(""); // Optional: Clear the field after submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {/* Amount Input */}
      <div>
        <Label htmlFor="amount" className="text-sm block mb-1">
          Withdrawal Amount
        </Label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Available: ₹${wallet?.wallet?.totalBalance ?? "0"}`}
        />
      </div>

      {/* Bank Details Section */}
      <div className="border rounded-md p-4 bg-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <BanknoteIcon className="h-5 w-5 text-green-600" />
          <p className="text-sm font-semibold">Bank Account Details</p>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <p>Bank Name: {bankDetails?.bankName || "N/A"}</p>
          <p>
            Account Number: ****
            {bankDetails?.accountNumber?.slice(-4) || "****"}
          </p>
          <p>IFSC Code: {bankDetails?.ifsc || "N/A"}</p>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Withdraw
      </Button>
    </form>
  );
};

export default WithdrawalForm;
