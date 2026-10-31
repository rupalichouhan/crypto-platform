import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addPaymentDetails } from "../../State/Withdrawal/Action";

const PaymentDetailsForm = () => {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountHolder: "",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifsc: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      addPaymentDetails({
        paymentDetails: {
          accountHolder: data.accountHolder,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifsc: data.ifsc,
        },
        jwt: localStorage.getItem("jwt"),
      })
    );
    console.log("Payment Details Submitted:", data);
  };

  return (
    <div className="max-w-md bg-gray-50 p-6 rounded-xl border space-y-4">
      <h2 className="text-2xl font-bold">Payment Details</h2>

      <Form>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Account Holder Name */}
          <FormItem>
            <FormLabel>Account Holder Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Rupali Chouhan"
                {...register("accountHolder", { required: "Account holder name is required" })}
              />
            </FormControl>
            <FormMessage>{errors.accountHolder?.message}</FormMessage>
          </FormItem>

          {/* Bank Name */}
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., HDFC Bank"
                {...register("bankName", { required: "Bank name is required" })}
              />
            </FormControl>
            <FormMessage>{errors.bankName?.message}</FormMessage>
          </FormItem>

          {/* Account Number */}
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter account number"
                {...register("accountNumber", { required: "Account number is required" })}
              />
            </FormControl>
            <FormMessage>{errors.accountNumber?.message}</FormMessage>
          </FormItem>

          {/* Confirm Account Number */}
          <FormItem>
            <FormLabel>Confirm Account Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Re-enter account number"
                {...register("confirmAccountNumber", {
                  required: "Please confirm your account number",
                  validate: (value) =>
                    value === watch("accountNumber") || "Account numbers do not match",
                })}
              />
            </FormControl>
            <FormMessage>{errors.confirmAccountNumber?.message}</FormMessage>
          </FormItem>

          {/* IFSC Code */}
          <FormItem>
            <FormLabel>IFSC Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., HDFC0001234"
                className="uppercase"
                {...register("ifsc", { required: "IFSC code is required" })}
              />
            </FormControl>
            <FormMessage>{errors.ifsc?.message}</FormMessage>
          </FormItem>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentDetailsForm;
