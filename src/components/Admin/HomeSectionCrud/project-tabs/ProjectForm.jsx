import React, { useEffect, useState } from "react";

const ProjectForm = ({ editingProject, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    short_desc: "",
    logo: null,
    banner: null,
  });

  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name,
        category: editingProject.category,
        short_desc: editingProject.short_desc,
        logo: null,
        banner: null,
      });
    } else {
      setForm({ name: "", category: "", short_desc: "", logo: null, banner: null });
    }
  }, [editingProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("short_desc", form.short_desc);
    if (form.logo) formData.append("logo", form.logo);
    if (form.banner) formData.append("banner", form.banner);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
      <input
        type="text"
        placeholder="Project Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-3 border rounded"
        required
      />
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full p-3 border rounded"
        required
      >
        <option value="">Select Category</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
        <option value="Future">Future</option>
      </select>
      <input
        type="text"
        placeholder="Short Description"
        value={form.short_desc}
        onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
        className="w-full p-3 border rounded"
        required
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, logo: e.target.files[0] })}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, banner: e.target.files[0] })}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-3">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editingProject ? "Update Project" : "Add Project"}
        </button>
        {editingProject && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
