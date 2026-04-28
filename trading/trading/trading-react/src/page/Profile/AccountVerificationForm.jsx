import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function AccountVerificationForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        // Simulate email verification (send OTP)
        console.log("Sending OTP to:", email);
        setStep(2);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            alert("OTP must be 6 digits.");
            return;
        }

        // Final submit callback
        handleSubmit({ email, otp });
    };

    return (
        <div className="space-y-6">
            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Enter your Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required />
                    </div>
                    <Button type="submit" className="w-full">
                        Send OTP
                    </Button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                            id="otp"
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            required />
                    </div>
                    <Button type="submit" className="w-full">
                        Verify & Submit
                    </Button>
                </form>
            )}
        </div>
    );
}

export default AccountVerificationForm;
