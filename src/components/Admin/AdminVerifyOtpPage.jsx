import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminVerifyOtpPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/admin/verify-otp`, {
        email,
        otp
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleVerify}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>

        {message && <p className="mb-4 text-center text-red-600">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default AdminVerifyOtpPage;
