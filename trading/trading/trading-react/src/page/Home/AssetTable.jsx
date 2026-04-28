import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function AssetTable({ coin, category }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatNumber = (num) =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">COIN</TableHead>
          <TableHead>SYMBOL</TableHead>
          <TableHead>VOLUME</TableHead>
          <TableHead>MARKET CAP</TableHead>
          <TableHead>24-HR</TableHead>
          <TableHead className="text-right">PRICE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coin.map((item, index) => (
          <TableRow key={item.id || index}>
            <TableCell
              onClick={() => navigate(`/market/${item.id}`)}
              className="font-medium flex items-center gap-2 cursor-pointer hover:underline"
            >
              <Avatar className="-z-50">
                <AvatarImage src={item.image} />
              </Avatar>
              <span>{item.name}</span>
            </TableCell>
            <TableCell>{item.symbol.toUpperCase()}</TableCell>
            <TableCell>{formatNumber(item.total_volume)}</TableCell>
            <TableCell>{formatNumber(item.market_cap)}</TableCell>
            <TableCell className={item.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
              {item.price_change_percentage_24h.toFixed(2)}%
            </TableCell>
            <TableCell className="text-right">${item.current_price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AssetTable;
