import React, { useMemo } from "react";

const bufferToBase64 = (buffer) => {
  if (!buffer || !buffer.length) return "";
  try {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (err) {
    console.error("base64 conversion error:", err);
    return "";
  }
};

const ProjectList = ({ projects, categoryFilter, onEdit, onDelete, onSelect, selectedProject }) => {
  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      categoryFilter === "All" ? true : p.category === categoryFilter
    );
  }, [projects, categoryFilter]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((proj) => (
        <div
          key={proj.id}
          className={`p-5 border rounded shadow-md transition-all cursor-pointer ${
            selectedProject?.id === proj.id ? "border-green-500 scale-105" : "hover:shadow-lg"
          }`}
          onClick={() => onSelect(proj)}
        >
          <h3 className="text-lg font-semibold">{proj.name}</h3>
          <p className="text-sm">{proj.short_desc}</p>
          <p className="text-xs text-gray-500 italic">{proj.category}</p>

          <div className="flex gap-2 mt-2">
            {proj.logo_blob?.data && (
              <img
                src={`data:image/jpeg;base64,${bufferToBase64(proj.logo_blob.data)}`}
                alt="logo"
                className="w-10 h-10 object-cover border rounded"
              />
            )}
            {proj.banner_blob?.data && (
              <img
                src={`data:image/jpeg;base64,${bufferToBase64(proj.banner_blob.data)}`}
                alt="banner"
                className="w-20 h-10 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={() => onEdit(proj)} className="text-blue-500 text-xs">Edit</button>
            <button onClick={() => onDelete(proj.id)} className="text-red-500 text-xs">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
