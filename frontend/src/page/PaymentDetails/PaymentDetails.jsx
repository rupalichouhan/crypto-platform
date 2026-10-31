import React, { useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDetails } from "../../State/Withdrawal/Action";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { paymentDetails, loading } = useSelector((state) => state.withdrawal);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getPaymentDetails(jwt));
    }
  }, [dispatch]);

  return (
    <div className="px-4 md:px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : paymentDetails ? (
        <Card>
          <CardHeader>
            <CardTitle>{paymentDetails.bankName || "Your Bank"}</CardTitle>
            <CardDescription>
              Account Holder: {paymentDetails.accountHolderName || "N/A"}
            </CardDescription>
            <CardDescription>
              Account Number: ****{paymentDetails.accountNumber?.slice(-4) || "****"}
            </CardDescription>
            <CardDescription>
              IFSC Code: {paymentDetails.ifscCode || "N/A"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <button className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Add Payment Details
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Your Bank Details</DialogTitle>
            </DialogHeader>
            <PaymentDetailsForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDetails;
