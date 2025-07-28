import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AboutUsSubsectionCrud = () => {
  const API = import.meta.env.VITE_API_BASE_URL + "/about-us/sections";

  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ heading: '', description: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API);
      setEntries(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("heading", form.heading);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
      } else {
        await axios.post(API, formData);
      }
      fetchEntries();
      setForm({ heading: '', description: '', image: null });
      setPreviewUrl(null);
      setEditingId(null);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ heading: entry.heading, description: entry.description, image: null });
    setPreviewUrl(entry.image);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchEntries();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          {editingId ? "Edit Subsection" : "Create Subsection"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              name="heading"
              value={form.heading}
              onChange={handleChange}
              required
              placeholder="Enter heading"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Enter description"
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lime-100 file:text-lime-700 file:font-semibold hover:file:bg-lime-200"
            />
          </div>

          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-w-md h-60 object-cover rounded-lg border border-gray-100 shadow-sm"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="px-6 py-3 bg-lime-600 text-white font-semibold rounded-lg hover:bg-lime-700 transition-all"
            >
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* Entries Section */}
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Existing Subsections</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center">No entries found.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <div className="flex gap-4 items-start">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt="entry"
                      className="w-24 h-24 object-cover rounded border border-gray-200"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{entry.heading}</h4>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
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

export default AboutUsSubsectionCrud;
