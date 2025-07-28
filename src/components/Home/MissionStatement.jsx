import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const MissionStatement = () => {
  const [mission, setMission] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/mission";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setLoading(true);
          setHasFetched(true);
          axios
            .get(API)
            .then((res) => setMission(res.data.data))
            .catch((err) =>
              console.error("Failed to fetch mission statement", err)
            )
            .finally(() => setLoading(false));
        }
      },
      { threshold: 0.25 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasFetched]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-[#f1fdf6] to-white py-20 px-6 md:px-10"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg px-8 md:px-16 py-14 text-center border border-gray-100">
        {loading ? (
          <div className="text-gray-500 text-xl">Loading...</div>
        ) : mission ? (
          <>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2d6a4f] mb-6 tracking-tight drop-shadow-sm">
              {mission.heading}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide">
              {mission.description}
            </p>
          </>
        ) : (
          <div className="text-gray-500 text-lg">Please check back later.</div>
        )}
      </div>
    </section>
  );
};

export default MissionStatement;
