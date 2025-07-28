import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectById,
  getHomeByProjectId,
  getGalleryByProjectId,
  getPlanByProjectId,
  getLocationByProjectId
} from "../../services/hprProjectsService";
import ProjectAmenitiesPublic from "./ProjectAmenitiesPublic";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const tabs = ["Home", "Gallery", "Plan", "Location", "Amenities"];
const ITEMS_PER_PAGE = 6;

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("Home");
  const [loadedTabs, setLoadedTabs] = useState({
    Home: false,
    Gallery: false,
    Plan: false,
    Location: false,
    Amenities: false
  });

  const [project, setProject] = useState(null);
  const [home, setHome] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [plan, setPlan] = useState(null);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const p = await getProjectById(id);
        setProject(p.data);
      } catch (err) {
        console.error("Project load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  useEffect(() => {
    if (!loadedTabs[selectedTab]) {
      fetchTabData(selectedTab);
      setLoadedTabs((prev) => ({ ...prev, [selectedTab]: true }));
    }
  }, [selectedTab]);

  const fetchTabData = async (tab) => {
    try {
      if (tab === "Home") {
        const cached = sessionStorage.getItem(`project-${id}-home`);
        if (cached) {
          setHome(JSON.parse(cached));
        } else {
          const h = await getHomeByProjectId(id);
          setHome(h.data);
          sessionStorage.setItem(`project-${id}-home`, JSON.stringify(h.data));
        }
      } else if (tab === "Gallery") {
        const g = await getGalleryByProjectId(id);
        setGallery(g.data || []);
      } else if (tab === "Plan") {
        const pl = await getPlanByProjectId(id);
        setPlan(pl.data);
      } else if (tab === "Location") {
        const loc = await getLocationByProjectId(id);
        setLocation(loc.data || []);
      }
    } catch (err) {
      console.error("Error loading tab data:", err);
    }
  };

  const paginatedGallery = gallery.slice(0, galleryPage * ITEMS_PER_PAGE);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Home":
        return home ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Home Section
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{home.title}</h3>
                <p className="text-lg text-gray-600 mb-4">{home.description}</p>
                {home.image && (
                  <img
                    src={`data:image/png;base64,${home.image}`}
                    alt="Home"
                    loading="lazy"
                    className="w-full max-w-2xl h-auto rounded-md shadow-sm mx-auto"
                  />
                )}
                {home.brochure_blob && (
                  <div className="mt-4 text-center">
                    <a
                      href={`data:application/pdf;base64,${home.brochure_blob}`}
                      download="brochure.pdf"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      📄 Download Brochure
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Loading Home content...</p>
        );

      case "Gallery":
        return (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Gallery Section
              </h2>
              {gallery.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No gallery items available.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedGallery.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          loading="lazy"
                          src={`data:image/png;base64,${item.image_blob}`}
                          alt="Gallery"
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.work_date}</p>
                      </div>
                    ))}
                  </div>
                  {gallery.length > paginatedGallery.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setGalleryPage((prev) => prev + 1)}
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "Plan":
        return plan ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Plan Section
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.description}</h3>
                {plan.plan_blob?.data ? (() => {
                  try {
                    const base64 = btoa(
                      new Uint8Array(plan.plan_blob.data)
                        .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
                    );
                    return (
                      <img
                        loading="lazy"
                        src={`data:image/png;base64,${base64}`}
                        alt="Plan"
                        className="w-full max-w-2xl h-auto rounded-md shadow-sm mx-auto"
                      />
                    );
                  } catch (err) {
                    console.error("Plan image render failed:", err);
                    return <p className="text-red-600 text-center">Failed to load plan image</p>;
                  }
                })() : (
                  <p className="text-gray-500 text-sm text-center italic">No plan uploaded.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8 italic">Plan not available.</p>
        );

      case "Location":
        return location && location.length > 0 ? (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Location Section
              </h2>
              <div className="space-y-6">
                {location.map((loc) => (
                  <div key={loc.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{loc.title}</h3>
                    <div className="w-full h-96 rounded-md overflow-hidden">
                      <iframe
                        src={loc.map_url}
                        title={`Map-${loc.id}`}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8 italic">Location not available.</p>
        );

      case "Amenities":
        return (
          <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Amenities Section
              </h2>
              <ProjectAmenitiesPublic projectId={id} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white pt-24">
        <DotLottieReact
          src="https://lottie.host/89abc775-d6a9-4278-91e8-93588bb9b5a3/GZ2c5sHZ6m.lottie"
          autoplay
          loop
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {project?.name || "Loading Project..."}
        </h1>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200 ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
