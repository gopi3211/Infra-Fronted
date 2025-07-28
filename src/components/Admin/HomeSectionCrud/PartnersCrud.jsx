import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PartnersCrud = () => {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL + '/partners';

  const fetchPartners = async () => {
    try {
      const res = await axios.get(API);
      console.log("API response for partners:", res.data);
      setPartners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      alert('All fields are required.');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        alert('Partner updated successfully');
      } else {
        await axios.post(API, form);
        alert('Partner created successfully');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchPartners();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert('Partner deleted successfully');
      fetchPartners();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Partners Management
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter partner name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Description
            </label>
            <textarea
              name="description"
              placeholder="Enter partner description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white h-24 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          >
            {editingId ? 'Update Partner' : 'Create Partner'}
          </button>
        </form>

        {/* Partner List */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Existing Partners
        </h3>
        {partners.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No partners added yet.</p>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{partner.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added on: {new Date(partner.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="px-4 py-1 text-sm bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersCrud;