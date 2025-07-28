import React, { useEffect, useState } from 'react';
import {
  getHomeByProjectId,
  createHome,
  updateHome,
  deleteHome,
} from '../../../../services/hprProjectsService';

const ProjectHomeCrud = ({ projectId }) => {
  const [homeData, setHomeData] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [brochureFile, setBrochureFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (projectId) fetchHomeData();
  }, [projectId]);

  const fetchHomeData = async () => {
    try {
      const res = await getHomeByProjectId(projectId);
      if (res.data) {
        setHomeData(res.data);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
        });
        setEditingId(res.data.id);
      } else {
        setHomeData(null);
        setForm({ title: '', description: '' });
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (brochureFile) formData.append("brochure", brochureFile);
      if (imageFile) formData.append("image", imageFile);

      if (editingId) {
        await updateHome(editingId, formData);
      } else {
        await createHome(formData);
      }

      fetchHomeData();
      setBrochureFile(null);
      setImageFile(null);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHome(editingId);
      setHomeData(null);
      setForm({ title: '', description: '' });
      setEditingId(null);
      setBrochureFile(null);
      setImageFile(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getImagePreview = () => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (homeData?.image) return `data:image/jpeg;base64,${homeData.image}`;
    return null;
  };

  const getPdfBlobUrl = () => {
    if (brochureFile) return URL.createObjectURL(brochureFile);
    if (homeData?.brochure) {
      const binary = Uint8Array.from(homeData.brochure.data);
      const blob = new Blob([binary], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🏠 Project Home Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📄 Upload Brochure (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBrochureFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              />
              {brochureFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {brochureFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🖼️ Upload Image (JPEG/PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              />
              {getImagePreview() && (
                <img
                  src={getImagePreview()}
                  alt="Preview"
                  className="mt-2 w-48 h-32 object-cover border rounded-md"
                />
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </form>

        {homeData && (
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🔍 Current Saved Data
            </h3>
            <p className="mb-2 text-gray-700">
              <strong>Title:</strong> {homeData.title}
            </p>
            <p className="mb-4 text-gray-600">
              <strong>Description:</strong> {homeData.description}
            </p>

            {getPdfBlobUrl() && (
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  <strong>Brochure:</strong>{' '}
                  <a
                    href={getPdfBlobUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    📄 View Brochure
                  </a>
                </p>
                <embed
                  src={getPdfBlobUrl()}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                  className="border rounded-md"
                />
              </div>
            )}

            {getImagePreview() && (
              <div className="mt-4">
                <p className="text-gray-700 mb-2">
                  <strong>Image:</strong>
                </p>
                <img
                  src={getImagePreview()}
                  alt="Saved"
                  className="w-48 h-32 object-cover border rounded-md"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHomeCrud;