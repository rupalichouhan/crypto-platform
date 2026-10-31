import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "../../State/Order/Action";

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return String(isoString);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Activity = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((store) => store.order);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getAllOrdersForUser({ jwt }));
    }
  }, [dispatch, jwt]);

  return (
    <div className="p-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Activity</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-600">No order history found.</p>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">DATE & TIME</TableHead>
              <TableHead>TRADING PAIR</TableHead>
              <TableHead>BUY PRICE</TableHead>
              <TableHead>SALE PRICE</TableHead>
              <TableHead>ORDER TYPE</TableHead>
              <TableHead>PROFIT/LOSS</TableHead>
              <TableHead className="text-right text-red-600">VALUE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((item, index) => {
              const isBuy = item.orderType === "BUY" || item.orderType === "Buy";
              const coinSymbol = item.orderItem?.coin?.symbol
                ? `${item.orderItem.coin.symbol.toUpperCase()}/USD`
                : item.symbol || "N/A";
              const buyPrice = item.orderItem?.buyPrice ?? item.buyPrice;
              const salePrice = item.orderItem?.sellPrice ?? item.salePrice;

              return (
                <TableRow key={item.id || index}>
                  <TableCell className="font-medium">
                    {formatDateTime(item.timestamp || item.dateTime)}
                  </TableCell>
                  <TableCell>{coinSymbol}</TableCell>
                  <TableCell>{buyPrice != null ? `$${buyPrice.toLocaleString()}` : "-"}</TableCell>
                  <TableCell>{salePrice != null ? `$${salePrice.toLocaleString()}` : "-"}</TableCell>
                  <TableCell className={isBuy ? "text-green-600" : "text-red-600"}>
                    {item.orderType}
                  </TableCell>
                  <TableCell
                    className={
                      String(item.profitLoss || "").startsWith("-")
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {item.profitLoss != null ? item.profitLoss : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.price?.toLocaleString() ?? 0}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Activity;
