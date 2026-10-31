import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { login } from '../../State/Auth/Action';

const SigninForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { jwt, loading, error } = useSelector((state) => state.auth);

  // Redirect to home if already logged in
  useEffect(() => {
    if (jwt) {
      navigate('/');
    }
  }, [jwt, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    dispatch(login({ email, password, navigate }));
    console.log('Login attempt with:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white max-w-md mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center">Sign In</h2>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <div>
        <label htmlFor="email" className="block mb-1">
          Enter your email
        </label>
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
        <label htmlFor="password" className="block mb-1">
          Enter your password
        </label>
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

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default SigninForm;
