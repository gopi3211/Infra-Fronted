import React, { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../../services/hprProjectsService";

const ProjectMainCrud = ({ onSelectProject, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      if (selectedProject?.id === id) onSelectProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">📁 Project Management</h2>

      <ProjectForm
        editingProject={editingProject}
        onSubmit={handleSubmit}
        onCancel={() => setEditingProject(null)}
      />

      <div className="flex gap-2">
        {["All", "Ongoing", "Completed", "Future"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded ${
              categoryFilter === cat ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <ProjectList
        projects={projects}
        categoryFilter={categoryFilter}
        onEdit={setEditingProject}
        onDelete={handleDelete}
        onSelect={onSelectProject}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default ProjectMainCrud;
