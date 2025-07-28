import React, { useEffect, useState } from 'react';
import {
  addLocation,
  getLocationByProjectId,
  updateLocation,
  deleteLocation,
} from '../../../../services/hprProjectsService';

const ProjectLocationCrud = ({ projectId }) => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ title: '', map_url: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (projectId) fetchLocations();
  }, [projectId]);

  const fetchLocations = async () => {
    try {
      const res = await getLocationByProjectId(projectId);
      console.log('Fetched locations:', res.data);
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch locations error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      project_id: projectId,
      iframe_link: form.map_url,
    };

    try {
      if (editingId) {
        await updateLocation(editingId, { iframe_link: form.map_url });
      } else {
        await addLocation(payload);
      }
      resetForm();
      fetchLocations();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, map_url: item.map_url });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', map_url: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          📍 Project Location
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter location title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Map URL
            </label>
            <input
              type="text"
              placeholder="Enter Google Map URL"
              value={form.map_url}
              onChange={(e) => setForm({ ...form, map_url: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            type="submit"
          >
            {editingId ? 'Update Location' : 'Add Location'}
          </button>
        </form>

        {locations.length === 0 ? (
          <p className="text-gray-500 text-sm">No locations added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white p-4 rounded-lg shadow-md relative hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{loc.title}</h3>
                {loc.map_url && (
                  <iframe
                    src={loc.map_url}
                    title={`Map-${loc.id}`}
                    className="w-full h-56 border border-gray-200 rounded-md"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-3 right-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(loc)}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="text-red-600 text-sm font-medium hover:text-red-800 transition-colors"
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

export default ProjectLocationCrud;