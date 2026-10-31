import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWithdrawalHistory } from "../../State/Withdrawal/Action";

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusColor = {
  SUCCESS: "text-green-600",
  PENDING: "text-yellow-500",
  DECLINE: "text-red-600",
};

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getWithdrawalHistory(jwt));
    }
  }, [dispatch, jwt]);

  return (
    <div className="p-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Withdrawal</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="py-3">DATE & TIME</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead className="text-right">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawal?.history?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{formatDateTime(item.date || item.createdAt)}</TableCell>
              <TableCell>${item.amount}</TableCell>
              <TableCell
                className={`text-right font-semibold ${statusColor[item.status?.toUpperCase()] || ""}`}
              >
                {item.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Withdrawal;
