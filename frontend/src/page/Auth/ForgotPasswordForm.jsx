import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password request for:", email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <h2 className="text-3xl font-semibold text-center">Reset Password</h2>

      <div>
        <label htmlFor="email" className="block mb-1">Enter your email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
        Send Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
