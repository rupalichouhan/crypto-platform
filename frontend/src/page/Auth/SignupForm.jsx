import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { register } from '../../State/Auth/Action';

const SignupForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(register(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <h2 className="text-3xl font-semibold text-center">Create New Account</h2>

      <div>
        <label htmlFor="fullName" className="block mb-1">Enter your full name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">Enter your email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1">Enter your password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
        Register
      </Button>
    </form>
  );
};

export default SignupForm;
