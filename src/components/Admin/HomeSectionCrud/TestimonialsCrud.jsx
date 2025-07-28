import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL + "/home/testimonials";

const TestimonialsCrud = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setTestimonials(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("❌ Failed to load testimonials");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchData();
        }
      },
      { threshold: 0.3 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasFetched]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message || (!image && !editingId)) {
      toast.error("❌ All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        toast.success("✅ Testimonial updated!");
      } else {
        await axios.post(API, formData);
        toast.success("✅ Testimonial added!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("❌ Failed to submit testimonial.");
    }
  };

  const resetForm = () => {
    setName("");
    setMessage("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setMessage(item.message);
    setPreview(`data:image/jpeg;base64,${item.image}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success("🗑️ Testimonial deleted");
        fetchData();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("❌ Failed to delete");
      }
    }
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Manage Testimonials
        </h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Customer name"
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <input
                type="text"
                placeholder="Testimonial message"
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  loading="lazy"
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-16 h-16 rounded-full object-cover border border-gray-300"
                />
              )}
              {image && (
                <p className="text-sm text-gray-600 mt-2">Selected: {image.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-semibold text-white ${
                editingId
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors duration-200`}
            >
              {editingId ? "Update Testimonial" : "Add Testimonial"}
            </button>
          </div>
        </form>

        {/* Testimonials Grid */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          All Testimonials
        </h3>
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No testimonials available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    loading="lazy"
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCrud;
