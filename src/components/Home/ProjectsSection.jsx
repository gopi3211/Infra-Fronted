import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 6;

const ProjectsSection = () => {
  const [projectData, setProjectData] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    axios
      .get(`${baseURL}/home/projects`)
      .then((res) => {
        const allProjects = res.data.data;
        setProjectData(allProjects);
        setVisibleProjects(allProjects.slice(0, ITEMS_PER_PAGE));
        setHasFetched(true);
      })
      .catch((err) => console.error("❌ Failed to fetch projects:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          fetchProjects();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [fetchProjects, hasFetched]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = nextPage * ITEMS_PER_PAGE;
    setVisibleProjects((prev) => [...prev, ...projectData.slice(start, end)]);
    setPage(nextPage);
  };

  const hasMore = visibleProjects.length < projectData.length;

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#e9f0ea] to-white py-20 px-6 md:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#4E7938] mb-16 tracking-tight drop-shadow-sm">
          Our Projects
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading projects...</p>
        ) : (
          <>
            <div className="grid gap-10 md:grid-cols-3">
              {visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out border border-gray-100"
                >
                  <img
                    src={`data:image/jpeg;base64,${project.image}`}
                    alt={project.title}
                    className="rounded-t-2xl w-full h-60 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-[#23424A] mb-3">
                      {project.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-700 mb-5">
                      {project.description}
                    </p>
                    <a
                      href="#"
                      className="text-[#4E7938] font-semibold hover:underline inline-block transition"
                    >
                      Continue →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-[#4E7938] text-white rounded-lg shadow hover:bg-[#3f652e] transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
