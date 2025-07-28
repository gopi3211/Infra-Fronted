import React, { useEffect, useState } from "react";
import { getAllProjects } from "../../services/hprProjectsService";
import { Link } from "react-router-dom";
import Footer from "../Home/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// 🔐 Safe base64 decoder
const bufferToBase64 = (buffer) => {
  try {
    if (!buffer || !buffer.length) return "";
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (err) {
    console.error("base64 conversion error:", err);
    return "";
  }
};

const HPRProjectsPublicPage = () => {
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [futureProjects, setFutureProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getAllProjects();
      const data = res.data;

      const ongoing = data.filter((p) => p.category?.toLowerCase() === "ongoing");
      const completed = data.filter((p) => p.category?.toLowerCase() === "completed");
      const future = data.filter((p) => p.category?.toLowerCase() === "future");

      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
      setFutureProjects(future);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const renderProjectCard = (project) => {
    const imageBlob = project.logo_blob?.data || project.banner_blob?.data;
    const imageSrc = imageBlob
      ? `data:image/jpeg;base64,${bufferToBase64(imageBlob)}`
      : "/default-image.jpg";

    return (
      <div
        key={project.id}
        className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
      >
        <img
          src={imageSrc}
          alt={project.name}
          className="w-full h-40 object-cover mb-4 rounded"
        />
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-3 line-clamp-2">{project.short_desc}</p>
        <Link
          to={`/project-details/${project.id}`}
          className="text-blue-600 font-medium hover:underline"
        >
          View More →
        </Link>
      </div>
    );
  };

  const noProjectsFallback = (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
      <DotLottieReact
        src="https://lottie.host/9343030f-63b0-4db2-a343-fe8d1fc61f79/nMsgnUsjDM.lottie"
        loop
        autoplay
        style={{ width: "180px", height: "180px" }}
      />
      <p className="text-lg font-medium text-gray-600 mt-4">
        Projects will be uploaded soon!
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Our Projects</h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 🔵 Ongoing Projects */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Ongoing Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingProjects.length > 0
                    ? ongoingProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>

              {/* ✅ Completed Projects */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.length > 0
                    ? completedProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>

              {/* 🔮 Future Projects */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Future Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {futureProjects.length > 0
                    ? futureProjects.map(renderProjectCard)
                    : noProjectsFallback}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default HPRProjectsPublicPage;
