import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { transferMoney } from "../../State/Wallet/Action";

const TransferForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: formData.walletId,
        reqData: {
          amount: formData.amount,
          purpose: formData.purpose,
        },
      })
    );
    if (onSubmit) onSubmit(formData);
    setFormData({ amount: "", walletId: "", purpose: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div>
        <Label className="text-sm block mb-1">Transfer Amount</Label>
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <Label className="text-sm block mb-1">Wallet ID</Label>
        <input
          name="walletId"
          type="text"
          value={formData.walletId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter recipient wallet ID"
        />
      </div>

      <div>
        <Label className="text-sm block mb-1">Purpose</Label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="E.g., Rent, gift, payment..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={wallet.loading}>
        {wallet.loading ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
};

export default TransferForm;
