import React, { useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletIcon, ArrowDownToLine, ArrowUpFromLine, Repeat2 } from 'lucide-react';
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawalForm from "./WithdrawalForm";
import { useDispatch, useSelector } from 'react-redux';
import { depositMoney, getUserWallet } from '../../State/Wallet/Action';
import { getWalletTransactions } from "../../State/Wallet/Action";
import { ReloadIcon } from '@radix-ui/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Wallet() {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const orderId = query.get("order_id");
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const navigate = useNavigate();

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  };

  const handleFetchWalletTransaction = () => {
  dispatch(getWalletTransactions(localStorage.getItem("jwt")));
  };

  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransaction();
  }, []);

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(`${type} submitted:`, data);
  };

  useEffect(() => {
    if (orderId) {
      dispatch(depositMoney({
        jwt: localStorage.getItem("jwt"),
        orderId,
        paymentId: razorpayPaymentId || paymentId,
        navigate
      }));
    }
  }, [orderId, paymentId, razorpayPaymentId]);

  return (
    <div className='flex flex-col items-center'>
      <div className='pt-10 w-full lg:w-[60%]'>
        <Card>
          <CardHeader className='pb-6'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-4'>
                <WalletIcon size={30} />
                <div>
                  <CardTitle className='text-2xl'>My Wallet</CardTitle>
                  <div className='flex items-center gap-2'>
                    <p className='text-gray-600 text-sm'>
                      #{wallet.userWallet?.walletId || '---'}
                    </p>
                    <ReloadIcon
                      onClick={handleFetchUserWallet}
                      className='cursor-pointer hover:text-muted-foreground' />
                  </div>
                </div>
              </div>
            </div>
            <CardDescription className='pt-4 text-sm text-gray-500'>
              Manage your crypto wallet balance and transaction history.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <p className='text-base font-semibold text-gray-800'>
              Balance: ${wallet.userWallet?.balance?.toFixed(2) || '0.00'}
            </p>

            <div className="flex gap-4 flex-wrap">
              {/* Add Money */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex gap-2 items-center">
                    <ArrowDownToLine size={16} /> Add Money
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Money</DialogTitle>
                  </DialogHeader>
                  <TopupForm onSubmit={(e) => handleSubmit(e, 'Add Money')} />
                </DialogContent>
              </Dialog>

              {/* Withdraw */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <ArrowUpFromLine size={16} /> Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm onSubmit={(e) => handleSubmit(e, 'Withdrawal')} />
                </DialogContent>
              </Dialog>

              {/* Transfer */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="flex gap-2 items-center">
                    <Repeat2 size={16} /> Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Funds</DialogTitle>
                  </DialogHeader>
                  <TransferForm onSubmit={(e) => handleSubmit(e, 'Transfer')} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>

          <CardFooter>
            <p className='text-sm text-muted-foreground'>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>

{/* Transaction History */}
<div className="mt-8 w-full">
  <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
  <div className="space-y-3">
    {wallet.transactions.length === 0 ? (
      <p className="text-sm text-muted-foreground">No transactions found.</p>
    ) : (
      wallet.transactions.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center border px-4 py-3 rounded-md"
        >
          <div>
            <p className="font-medium">${item.amount}</p>
            <p className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()} at{" "}
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              item.type === "Add Money"
                ? "bg-green-100 text-green-700": item.type === "Withdrawal"? "bg-red-100 text-red-700": "bg-blue-100 text-blue-700"}`}
                >
            {item.type}
          </span>
        </div>
      ))
    )}
  </div>
</div>
      </div>
    </div>
  );
}
export default Wallet;