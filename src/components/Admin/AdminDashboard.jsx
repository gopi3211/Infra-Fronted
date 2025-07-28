import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

const sections = [
  { name: 'Home Section', path: '/admin/home/crud' },
  { name: 'About Us Section', path: '/admin/about' },
  { name: 'About Us Subsections', path: '/admin/about/subsections' },
  { name: 'Projects Section', path: '/admin/projects' },
  { name: 'Gallery Section', path: '/admin/gallery' },
  { name: 'News & Updates', path: '/admin/news' },
  { name: 'Contact Us', path: '/admin/contact' }, // ✅ Already added
  { name: 'User Management', path: '/admin/users' },
  { name: 'Our Partners', path: '/admin/partners' },
  { name: 'Email Settings', path: '/admin/email-settings' }, // ✅ Add this new line
];




  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-lime-600">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-lime-200 hover:bg-lime-300 p-4 rounded-lg shadow cursor-pointer transition duration-300 text-center"
              onClick={() => navigate(section.path)}
            >
              <h2 className="text-xl font-semibold text-gray-700">{section.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
