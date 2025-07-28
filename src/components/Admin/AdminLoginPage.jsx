import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        email,
        password
      });
      const { token, admin } = res.data;
      localStorage.setItem('adminToken', token);
      window.dispatchEvent(new Event('storage'));

      localStorage.setItem('adminInfo', JSON.stringify(admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md mb-6"
        />

        <button
          type="submit"
          className="w-full bg-[#a8cf45] hover:bg-[#94b33b] text-white py-2 px-4 rounded-md font-semibold"
        >
          Login
        </button>

        {/* 👉 Add Register link */}
        <p className="text-center text-sm mt-4">
          No account yet?{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate('/admin/register')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminLoginPage;
