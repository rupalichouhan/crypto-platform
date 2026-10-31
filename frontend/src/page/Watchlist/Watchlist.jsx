import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserWatchlist,
  addItemToWatchlist,
} from "../../State/Watchlist/Action";
import {
  Table, TableHeader, TableHead,
  TableBody, TableRow, TableCell
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Watchlist = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const { items = [], loading, error } = useSelector((store) => store.watchlist);

  useEffect(() => {
    if (jwt) {
      dispatch(getUserWatchlist({ jwt }));
    }
  }, [dispatch, jwt]);

  const handleRemoveFromWatchlist = (value) => {
    dispatch(addItemToWatchlist({ coinId: value, jwt }));
    console.log(value);
  };

  if (loading) return <p className="p-5">Loading…</p>;
  if (error) return <p className="p-5 text-red-600">Error: {error}</p>;

  return (
    <div className="p-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Watchlist</h1>
      {items.length === 0 ? (
        <p>No coins in your watchlist.</p>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>COIN</TableHead>
              <TableHead>SYMBOL</TableHead>
              <TableHead>VOLUME</TableHead>
              <TableHead>MARKET CAP</TableHead>
              <TableHead>24‑HR</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>ACTION</TableHead> {/* <-- Add column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((coin, index) => (
              <TableRow key={coin.id || index}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="shrink-0">
                    <AvatarImage src={coin.image} alt={coin.name} />
                  </Avatar>
                  {coin.name}
                </TableCell>
                <TableCell>{coin.symbol?.toUpperCase()}</TableCell>
                <TableCell>{coin.total_volume}</TableCell>
                <TableCell>{coin.market_cap}</TableCell>
                <TableCell
                  className={
                    coin.price_change_percentage_24h?.toString().startsWith("-")
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {coin.price_change_percentage_24h}
                </TableCell>
                <TableCell>{coin.current_price}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromWatchlist(coin.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Watchlist;
