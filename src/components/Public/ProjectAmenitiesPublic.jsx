import React, { useEffect, useState } from "react";
import { getAmenitiesByProjectId } from "../../services/hprProjectsService";

const ProjectAmenitiesPublic = ({ projectId }) => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchAmenities();
    }
  }, [projectId]);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenitiesByProjectId(projectId);
      if (res?.data?.length > 0) {
        const data = res.data[0];
        setInfrastructure(JSON.parse(data.infrastructure));
        setFeatures(JSON.parse(data.features));
      }
    } catch (error) {
      console.error("Failed to load amenities", error);
    }
  };

  return (
    <div className="my-10 p-6 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🏗️ Infrastructure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infrastructure.map((item, idx) => (
          <div key={idx} className="p-4 bg-white border rounded shadow-sm">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Features</h2>
      <ul className="list-disc list-inside">
        {features.map((item, idx) => (
          <li key={idx} className="text-gray-700">{item.feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectAmenitiesPublic;
