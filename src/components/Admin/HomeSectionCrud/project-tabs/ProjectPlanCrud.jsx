import React, { useEffect, useState } from 'react';
import {
  addPlan,
  getPlanByProjectId,
  updatePlan,
  deletePlan,
} from '../../../../services/hprProjectsService';

const ProjectPlanCrud = ({ projectId }) => {
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({ description: '', file: null });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (projectId) fetchPlan();
  }, [projectId]);

  const fetchPlan = async () => {
    try {
      const res = await getPlanByProjectId(projectId);
      const data = res.data;

      if (data) {
        let base64Image = null;

        if (data.plan_blob?.data) {
          const uint8Array = new Uint8Array(data.plan_blob.data);
          const binary = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          base64Image = `data:image/jpeg;base64,${btoa(binary)}`;
        }

        setPlan({
          id: data.id,
          description: data.description,
          image_url: base64Image,
        });
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Fetch plan error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !projectId || (!form.file && !editing)) {
      alert('All fields required');
      return;
    }

    const formData = new FormData();
    formData.append('description', form.description);
    if (form.file) formData.append('plan', form.file);
    if (!editing) formData.append('project_id', projectId);

    try {
      if (editing && plan?.id) {
        await updatePlan(plan.id, formData);
      } else {
        await addPlan(formData);
      }
      resetForm();
      fetchPlan();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async () => {
    if (!plan?.id) return;
    try {
      await deletePlan(plan.id);
      setPlan(null);
      resetForm();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = () => {
    setForm({ description: plan.description, file: null });
    setEditing(true);
  };

  const resetForm = () => {
    setForm({ description: '', file: null });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          📐 Project Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Description
            </label>
            <input
              type="text"
              placeholder="Enter plan description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Plan (Image/PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
            {form.file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {form.file.name}
              </p>
            )}
          </div>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            type="submit"
          >
            {editing ? 'Update Plan' : 'Add Plan'}
          </button>
        </form>

        {plan && (
          <div className="bg-white p-4 rounded-lg shadow-md relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.description}</h3>
            {plan.image_url ? (
              <img
                src={plan.image_url}
                alt="Plan"
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            ) : (
              <p className="text-gray-500 text-sm">No plan available</p>
            )}
            <div className="absolute top-3 right-3 flex gap-3">
              <button
                onClick={handleEdit}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 text-sm font-medium hover:text-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPlanCrud;