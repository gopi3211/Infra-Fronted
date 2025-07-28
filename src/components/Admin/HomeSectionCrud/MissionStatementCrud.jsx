import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MissionStatementCrud = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL + "/mission";

  // Scroll-triggered fetch
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchMission();
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

  const fetchMission = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.data) {
        setHeading(res.data.data.heading);
        setDescription(res.data.data.description);
      }
    } catch (err) {
      console.error("Failed to fetch mission statement", err);
      toast.error("❌ Failed to fetch mission statement.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !description) {
      toast.error("❌ Please fill in both heading and description.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(API_URL, { heading, description });
      toast.success("✅ Mission statement updated successfully!");
    } catch (err) {
      console.error("Failed to update mission", err);
      toast.error("❌ Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Update Mission Statement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter mission heading"
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Enter mission description"
              className="w-full p-3 border border-gray-300 rounded-md bg-white resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Mission Statement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MissionStatementCrud;
