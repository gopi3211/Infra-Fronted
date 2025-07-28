import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/');
    window.location.reload(); // full refresh to reset state
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#a8cf45] z-50 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-8 py-1 flex justify-between items-center">
        {/* Logo */}
        <div className="bg-white px-4 py-2 rounded-md shadow-md flex items-center space-x-3">
          <img src="/logo.png" alt="HPR Logo" className="h-20 w-auto" />
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex space-x-10">
          <Link to="/" className="text-white text-lg md:text-xl font-semibold no-underline hover:no-underline">
            Home
          </Link>
          <Link to="/about" className="text-white text-lg md:text-xl font-semibold no-underline hover:no-underline">
            About Us
          </Link>
          <Link to="/projects" className="text-white text-lg md:text-xl font-semibold no-underline hover:no-underline">
            Projects
          </Link>
         <Link to="/gallery" className="text-white text-lg md:text-xl font-semibold no-underline hover:no-underline">
  Gallery
</Link>

        <Link to="/news" className="text-white text-lg md:text-xl font-semibold no-underline hover:no-underline">
  News & Updates
</Link>


        <li>
  <Link to="/contact" className="hover:text-lime-600">Contact Us</Link>
</li>

        </nav>

        {/* Admin Control Buttons */}
        <div className="flex items-center space-x-4 ml-6">
          {isLoggedIn ? (
            <>
              {/* ✅ Dashboard Button */}
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center space-x-2 bg-white text-[#a8cf45] hover:bg-[#d7f5a8] font-semibold px-4 py-2 rounded-full shadow-md transition"
              >
                <FaTachometerAlt className="text-xl" />
                <span>My Dashboard</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white text-[#a8cf45] hover:bg-[#d7f5a8] font-semibold px-4 py-2 rounded-full shadow-md transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 bg-white text-[#a8cf45] hover:bg-[#d7f5a8] font-semibold px-4 py-2 rounded-full shadow-md transition"
            >
              <FaUserCircle className="text-xl" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;









