
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "lucide-react";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TradingForm from "./Tradingform";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "../../State/Coin/Action";
import { addItemToWatchlist, getUserWatchlist } from "../../State/Watchlist/Action";

function StockDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin,watchlist } = useSelector((store) => store);
  const details = coin?.coinDetails;
  const [message, setMessage] = useState("");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (id && jwt) {
      dispatch(fetchCoinDetails({ coinId: id, jwt }));
      dispatch(getUserWatchlist({ jwt }));
    };})

  const handleAddToWatchlist = async () => {
    try {
      dispatch(addItemToWatchlist({ coinId: id, jwt }));
      setMessage("Added to watchlist");
    } catch (error) {
      setMessage("Failed to add to watchlist");
    } finally {
      clearMessageAfterDelay();
    }
  };

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  if (!details) {
    return <div className="p-5">Loading coin details...</div>;
  }

  const { name, symbol, image, market_data: marketData } = details;
  const isNegative = marketData?.market_cap_change_24h < 0;

  return (
    <div className="p-5 mt-5 border rounded shadow-sm">
      {message && (
        <div className="mb-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-800">
          {message}
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-5 items-center">
        <div className="flex gap-5 items-center">
          <Avatar>
            <AvatarImage src={image?.large} alt={name} />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold uppercase">{symbol}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-400">{name}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">
                ${marketData?.current_price?.usd.toLocaleString()}
              </p>
              <p className={isNegative ? "text-red-600" : "text-green-600"}>
                <span>
                  {marketData?.market_cap_change_24h?.toLocaleString()}
                </span>
                <span>
                  {" "}
                  ({marketData?.market_cap_change_percentage_24h?.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              handleAddToWatchlist();
            }}
            title={existInWatchlist(watchlist.items,details) ? "Remove from Bookmarks" : "Add to Bookmarks"}
          >
            {existInWatchlist(watchlist.items,items) ? (
              <BookmarkFilledIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Trade
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How much do you want to spend?</DialogTitle>
              </DialogHeader>
              <TradingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-10">
        <StockChart coinId={id} />
      </div>
    </div>
  );
}

export default StockDetails;