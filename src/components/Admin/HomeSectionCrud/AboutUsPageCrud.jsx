import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUsPageCrud = () => {
  const [formData, setFormData] = useState({ heading: '', description: '', image: null });
  const [aboutUsData, setAboutUsData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/about-us`);
      setAboutUsData(res.data);
    } catch (error) {
      console.error('Error fetching About Us data:', error);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/about-us/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/about-us`, data);
      }
      fetchAboutUs();
      setFormData({ heading: '', description: '', image: null });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error submitting About Us data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ heading: item.heading, description: item.description, image: null });
    if (item.image) {
      setPreviewUrl(item.image);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/about-us/${id}`);
      fetchAboutUs();
    } catch (error) {
      console.error('Error deleting About Us data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      
      
      
      <div className="max-w-4xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            {editingId ? 'Edit About Us Section' : 'Create About Us Section'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="heading"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Heading
              </label>
              <input
                type="text"
                name="heading"
                id="heading"
                placeholder="Enter heading"
                value={formData.heading}
                onChange={handleChange}
className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out text-gray-900 placeholder-gray-400"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image
              </label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all duration-200"
              />
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover rounded-lg shadow-md border border-gray-100"
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>

        {/* Entries Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Existing Entries</h3>
          {aboutUsData.length === 0 ? (
            <p className="text-gray-500 text-center">No entries found.</p>
          ) : (
            <div className="grid gap-6">
              {aboutUsData.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Entry"
                        className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-100"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.heading}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
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
    </div>











  );
};

export default AboutUsPageCrud;