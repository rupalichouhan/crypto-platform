import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "lucide-react";
import { getUserWallet } from "../../State/Wallet/Action";
import { getAssetDetails } from "../../State/Asset/Action";

function TradingForm() {
  const [orderType, setOrderType] = useState("BUY");
  const [amountInput, setAmountInput] = useState("");
  const [quantity, setQuantity] = useState("");

  const dispatch = useDispatch();
  const { coin, wallet, asset } = useSelector((store) => store);

  const coinDetails = coin?.coinDetails;
  const coinId = coinDetails?.id;
  const name = coinDetails?.name || "Unknown";
  const symbol = coinDetails?.symbol?.toUpperCase() || "---";
  const price = coinDetails?.market_data?.current_price?.usd || 0;
  const change = coinDetails?.market_data?.price_change_24h || 0;
  const changePercent = coinDetails?.market_data?.price_change_percentage_24h || 0;
  const imageUrl = coinDetails?.image?.large || "https://via.placeholder.com/40";

  const walletBalance = wallet?.userWallet?.balance || 0;
  const assetQuantity = asset?.assetDetails?.quantity || 0;

  const isNegative = change < 0;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && coinId) {
      dispatch(getUserWallet(jwt));
      dispatch(getAssetDetails({ coinId, jwt }));
    }
  }, [dispatch, coinId]);

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value;
    setAmountInput(input);

    const numericInput = parseFloat(input);
    if (!numericInput || price === 0) {
      setQuantity("");
      return;
    }

    const calculatedQty = orderType === "BUY"
      ? numericInput / price
      : numericInput; // In SELL, input is already quantity

    setQuantity(calculatedQty.toFixed(6));
  };

  // Submit order
  const handleSubmit = () => {
    const inputAmount = parseFloat(amountInput);
    const inputQty = parseFloat(quantity);

    if (!inputAmount || inputAmount <= 0 || isNaN(inputQty)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (orderType === "BUY" && inputAmount > walletBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    if (orderType === "SELL" && inputQty > assetQuantity) {
      alert("Insufficient asset quantity.");
      return;
    }

    const order = {
      type: orderType,
      coinId,
      name,
      symbol,
      price,
      amount: orderType === "BUY" ? inputAmount : price * inputQty,
      quantity: inputQty,
      time: new Date().toISOString(),
    };

    console.log("Order submitted:", order);
    alert(`${orderType} order submitted successfully!`);

    // Reset inputs
    setAmountInput("");
    setQuantity("");
  };

  // Switch order type and reset input
  const toggleOrderType = () => {
    setOrderType(orderType === "BUY" ? "SELL" : "BUY");
    setAmountInput("");
    setQuantity("");
  };

  const showInsufficient =
    (orderType === "BUY" && parseFloat(amountInput) > walletBalance) ||
    (orderType === "SELL" && parseFloat(quantity) > assetQuantity);

  return (
    <div className="space-y-10 p-5">
      {/* Input Field */}
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7"
            placeholder={orderType === "BUY" ? "Enter amount in USD..." : "Enter quantity..."}
            type="number"
            value={amountInput}
            onChange={handleInputChange}
          />
          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity || "0"}
            </p>
          </div>
        </div>

        {showInsufficient && (
          <p className="text-red-600 text-center pt-4">
            {orderType === "BUY" ? "Insufficient wallet balance." : "Insufficient asset quantity."}
          </p>
        )}
      </div>

      {/* Coin Details */}
      <div className="flex gap-5 items-center">
        <Avatar>
          <AvatarImage src={imageUrl} />
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{symbol}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">${price.toLocaleString()}</p>
            <p className={isNegative ? "text-red-600" : "text-green-600"}>
              {change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Info Summary */}
      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>

      <div className="flex items-center justify-between">
        <p>{orderType === "BUY" ? "Available Balance" : "Available Quantity"}</p>
        <p>{orderType === "BUY" ? `$${walletBalance}` : assetQuantity}</p>
      </div>

      {/* Action Buttons */}
      <div>
        <Button
          onClick={handleSubmit}
          className={`w-full py-6 ${orderType === "SELL" ? "bg-red-600 text-white" : ""}`}
          disabled={!amountInput || parseFloat(amountInput) <= 0}
        >
          {orderType}
        </Button>

        <Button
          variant="link"
          className="w-full mt-5 text-xl"
          onClick={toggleOrderType}
        >
          {orderType === "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
}

export default TradingForm;
