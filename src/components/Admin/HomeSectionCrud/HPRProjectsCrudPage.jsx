import React, { useState } from "react";
import ProjectMainCrud from "./project-tabs/ProjectMainCrud";
import ProjectHomeCrud from "./project-tabs/ProjectHomeCrud";
import ProjectGalleryCrud from "./project-tabs/ProjectGalleryCrud";
import ProjectPlanCrud from "./project-tabs/ProjectPlanCrud";
import ProjectLocationCrud from "./project-tabs/ProjectLocationCrud";
import ProjectAmenitiesCrud from "./project-tabs/ProjectAmenitiesCrud";

const tabs = ["PROJECT", "HOME", "GALLERY", "PLAN", "LOCATION", "AMENITIES"];

const HPRProjectsCrudPage = () => {
  const [activeTab, setActiveTab] = useState("PROJECT");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🛠️ HPR Projects Management
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-green-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Filter only for PROJECT tab */}
        {activeTab === "PROJECT" && (
          <div className="flex gap-3 justify-center mb-6 flex-wrap">
            {["All", "Ongoing", "Completed", "Future"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-green-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Tab Panels */}
        {activeTab === "PROJECT" && (
          <ProjectMainCrud
            onSelectProject={setSelectedProject}
            selectedProject={selectedProject}
            selectedCategory={selectedCategory}
          />
        )}

        {activeTab === "HOME" && selectedProject && (
          <ProjectHomeCrud projectId={selectedProject?.id} />
        )}
        {activeTab === "GALLERY" && selectedProject && (
          <ProjectGalleryCrud projectId={selectedProject?.id} />
        )}
        {activeTab === "PLAN" && selectedProject && (
          <ProjectPlanCrud projectId={selectedProject?.id} />
        )}
        {activeTab === "LOCATION" && selectedProject && (
          <ProjectLocationCrud projectId={selectedProject?.id} />
        )}
        {activeTab === "AMENITIES" && selectedProject && (
          <ProjectAmenitiesCrud projectId={selectedProject?.id} />
        )}

        {!selectedProject && activeTab !== "PROJECT" && (
          <div className="text-center bg-red-50 text-red-600 p-4 rounded-md shadow-sm mt-8 max-w-md mx-auto">
            ⚠️ Please select a project first from the PROJECT tab to continue.
          </div>
        )}
      </div>
    </div>
  );
};

export default HPRProjectsCrudPage;