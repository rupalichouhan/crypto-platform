import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, ShieldOff } from "lucide-react";
import AccountVerificationForm from "./AccountVerificationForm";

const Profile = () => {
  const auth = useSelector((store) => store.auth);
  const user = auth?.user || {};

  const [isTwoStepEnabled, setIsTwoStepEnabled] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleEnableTwoStepVerification = (data) => {
    console.log("Verification data:", data);
    setIsTwoStepEnabled(true);
    setShowDialog(false);
  };

  return (
    <div className="p-5 lg:px-20 space-y-6">
      {/* Profile Info */}
      <div className="text-2xl font-bold">Profile Information</div>
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><span className="font-semibold">Email:</span> {user?.email || "N/A"}</div>
          <div><span className="font-semibold">Username:</span> {user?.fullName || "N/A"}</div>
          <div><span className="font-semibold">Date of Birth:</span> {user.dateOfBirth || "N/A"}</div>
          <div><span className="font-semibold">Nationality:</span> {user.nationality || "N/A"}</div>
          <div><span className="font-semibold">Address:</span> {user.address || "N/A"}</div>
          <div><span className="font-semibold">City:</span> {user.city || "N/A"}</div>
          <div><span className="font-semibold">Postcode:</span> {user.postcode || "N/A"}</div>
          <div><span className="font-semibold">Country:</span> {user.country || "N/A"}</div>
        </CardContent>
      </Card>

      {/* Two Step Verification */}
      <Card className="w-full mt-6">
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <CardTitle>Two Step Verification</CardTitle>
            <div className="flex items-center space-x-2">
              {isTwoStepEnabled ? (
                <Badge className="bg-green-600 text-white">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Enabled
                </Badge>
              ) : (
                <Badge className="bg-orange-500 text-white">
                  <ShieldOff className="h-4 w-4 mr-1" /> Disabled
                </Badge>
              )}
            </div>
          </div>

          {/* Dialog trigger button */}
          {!isTwoStepEnabled && (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="default">Enable</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Your Account</DialogTitle>
                </DialogHeader>
                <AccountVerificationForm handleSubmit={handleEnableTwoStepVerification} />
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
      </Card>
    </div>
  );
};

export default Profile;
