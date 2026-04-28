import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserAssets } from "../../State/Asset/Action";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { asset } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getUserAssets({jwt}));
  }, [dispatch]);

  return (
    <div className="p-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Portfolio</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ASSET</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>UNIT</TableHead>
            <TableHead>CHANGE</TableHead>
            <TableHead>CHANGE%</TableHead>
            <TableHead className="text-right">VOLUME</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(asset || []).map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="shrink-0">
                  <AvatarImage src={item.image} alt={item.name} />
                </Avatar>
                <span>{item.name}</span>
              </TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className={item.change?.startsWith("-") ? "text-red-600" : "text-green-600"}>
                {item.change}
              </TableCell>
              <TableCell className={item.changePercent?.startsWith("-") ? "text-red-600" : "text-green-600"}>
                {item.changePercent}
              </TableCell>
              <TableCell className="text-right">{item.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Portfolio;
