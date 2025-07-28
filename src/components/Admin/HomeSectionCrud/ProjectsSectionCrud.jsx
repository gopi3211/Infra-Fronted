import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProjectsSectionCrud = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/home/projects`);
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast.error("❌ Failed to fetch project data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchProjects();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || (!image && !editingId)) {
      toast.error("❌ All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      if (editingId) {
        await axios.put(`${baseURL}/home/projects/${editingId}`, formData);
        toast.success("✅ Project updated successfully!");
      } else {
        await axios.post(`${baseURL}/home/projects`, formData);
        toast.success("✅ Project added successfully!");
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Error submitting project:', err);
      toast.error("❌ Operation failed.");
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setPreviewImage(`data:image/jpeg;base64,${project.image}`);
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${baseURL}/home/projects/${id}`);
      toast.success("🗑️ Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error("❌ Failed to delete project.");
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Projects Section Management
        </h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white h-24 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) setPreviewImage(URL.createObjectURL(file));
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
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          All Projects
        </h3>
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  loading="lazy"
                  src={`data:image/jpeg;base64,${project.image}`}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
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

export default ProjectsSectionCrud;
