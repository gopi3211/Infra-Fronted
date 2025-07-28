import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_BASE_URL + '/home/company-values';

const CompanyValuesCrud = () => {
  const [values, setValues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const fetchValues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setValues(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error("❌ Failed to load values");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchValues();
        }
      },
      { threshold: 0.3 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasFetched]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || (!image && !editingId)) {
      toast.error("❌ All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image instanceof File) formData.append('image', image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        toast.success("✅ Value updated successfully!");
      } else {
        await axios.post(API, formData);
        toast.success("✅ Value added successfully!");
      }
      resetForm();
      fetchValues();
    } catch (err) {
      console.error('Submit error:', err);
      toast.error("❌ Operation failed.");
    }
  };

  const handleEdit = (value) => {
    setTitle(value.title);
    setDescription(value.description);
    setPreviewImage(`data:image/jpeg;base64,${value.image}`);
    setEditingId(value.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this value?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("🗑️ Value deleted");
      fetchValues();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error("❌ Delete failed");
    }
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Company Values Management
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter value title"
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter value description"
              className="w-full p-3 border border-gray-300 rounded-md bg-white h-24 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreviewImage(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
            {previewImage && (
              <img
                loading="lazy"
                src={previewImage}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-md"
              />
            )}
            {image && (
              <p className="text-sm text-gray-600 mt-2">Selected: {image.name}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          >
            {editingId ? 'Update Value' : 'Add Value'}
          </button>
        </form>

        {/* List */}
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">All Values</h3>
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : values.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No values available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val) => (
              <div
                key={val.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  loading="lazy"
                  src={`data:image/jpeg;base64,${val.image}`}
                  alt={val.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">{val.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{val.description}</p>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(val)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(val.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyValuesCrud;
