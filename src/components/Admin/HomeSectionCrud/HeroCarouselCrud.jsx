import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 6;

const SlideCard = React.memo(({ slide, onEdit, onDelete }) => {
  const imageSrc = useMemo(() => {
    return `data:image/jpeg;base64,${btoa(
      new Uint8Array(slide.image.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )}`;
  }, [slide.image.data]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <img
        loading="lazy"
        src={imageSrc}
        alt={slide.heading}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-900">{slide.heading}</h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.subheading}</p>
        <div className="mt-4 flex justify-between gap-2">
          <button
            onClick={() => onEdit(slide)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(slide.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

const HeroCarouselCrud = () => {
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  const fetchSlides = async () => {
    try {
      const res = await axios.get(API);
      setSlides(res.data.data);
    } catch (err) {
      console.error("Failed to fetch slides", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const paginatedSlides = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return slides.slice(start, end);
  }, [slides, page]);

  const totalPages = Math.ceil(slides.length / PAGE_SIZE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !subheading || (!image && !editingId)) {
      toast.error("❌ All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        toast.success("✅ Slide updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(API, formData);
        toast.success("✅ Slide added successfully!");
      }

      setHeading("");
      setSubheading("");
      setImage(null);
      fetchSlides();
    } catch (err) {
      console.error("Error submitting form", err);
      toast.error("❌ Submission failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("🗑️ Slide deleted successfully!");
      fetchSlides();
    } catch (err) {
      console.error("Failed to delete", err);
      toast.error("❌ Delete failed.");
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Hero Carousel Management
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              placeholder="Enter heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subheading
            </label>
            <input
              type="text"
              placeholder="Enter subheading"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
            {image && (
              <p className="text-sm text-gray-600 mt-2">Selected: {image.name}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white ${
              editingId
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors duration-200`}
          >
            {editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          All Slides
        </h3>
        {slides.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No slides available.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSlides.map((slide) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroCarouselCrud;
