import React, { useEffect, useState } from "react";
import {
  getAmenitiesByProjectId,
  createAmenities,
  updateAmenities,
  deleteAmenities,
} from "../../../../services/hprProjectsService";
import { toast } from "react-toastify";

const ProjectAmenitiesCrud = ({ selectedProject }) => {
  const [amenitiesId, setAmenitiesId] = useState(null);
  const [infrastructure, setInfrastructure] = useState([{ title: "", description: "" }]);
  const [features, setFeatures] = useState([{ feature: "" }]);

  useEffect(() => {
    if (selectedProject?.id) fetchAmenities();
  }, [selectedProject]);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenitiesByProjectId(selectedProject.id);
      if (res?.length > 0) {
        const data = res[0];
        setAmenitiesId(data.id);
        setInfrastructure(JSON.parse(data.infrastructure));
        setFeatures(JSON.parse(data.features));
      } else {
        setAmenitiesId(null);
        setInfrastructure([{ title: "", description: "" }]);
        setFeatures([{ feature: "" }]);
      }
    } catch (err) {
      toast.error("Failed to fetch amenities");
    }
  };

  const handleInfraChange = (index, key, value) => {
    const updated = [...infrastructure];
    updated[index][key] = value;
    setInfrastructure(updated);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index].feature = value;
    setFeatures(updated);
  };

  const addInfra = () => setInfrastructure([...infrastructure, { title: "", description: "" }]);
  const addFeature = () => setFeatures([...features, { feature: "" }]);

  const removeInfra = (index) => {
    const updated = [...infrastructure];
    updated.splice(index, 1);
    setInfrastructure(updated);
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const handleSave = async () => {
    const payload = {
      project_id: selectedProject.id,
      infrastructure: JSON.stringify(infrastructure),
      features: JSON.stringify(features),
    };

    try {
      if (amenitiesId) {
        await updateAmenities(amenitiesId, payload);
        toast.success("Amenities updated");
      } else {
        await createAmenities(payload);
        toast.success("Amenities added");
      }
      fetchAmenities();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!amenitiesId) return;
    try {
      await deleteAmenities(amenitiesId);
      toast.success("Deleted successfully");
      setAmenitiesId(null);
      setInfrastructure([{ title: "", description: "" }]);
      setFeatures([{ feature: "" }]);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🏢 Manage Amenities
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Infrastructure</h3>
            {infrastructure.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center mt-2">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter title"
                    value={item.title}
                    onChange={(e) => handleInfraChange(idx, "title", e.target.value)}
                  />
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter description"
                    value={item.description}
                    onChange={(e) => handleInfraChange(idx, "description", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeInfra(idx)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              onClick={addInfra}
              className="mt-3 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              + Add Infrastructure
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
            {features.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center mt-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feature
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter feature"
                    value={item.feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeFeature(idx)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              + Add Feature
            </button>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            {amenitiesId && (
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAmenitiesCrud;