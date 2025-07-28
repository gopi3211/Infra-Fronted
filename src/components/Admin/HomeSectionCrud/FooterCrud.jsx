import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL + "/home/footer";

const FooterCrud = () => {
  const [footer, setFooter] = useState([]);
  const [form, setForm] = useState({
    tagline: "",
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    logo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const fetchFooter = async () => {
    try {
      const res = await axios.get(API);
      if (res.data && res.data.data) {
        setFooter([res.data.data]);
        setForm({ ...res.data.data, logo: null });
        setEditingId(res.data.data.id);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("❌ Failed to load footer data.");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchFooter();
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, logo: file });
    setPreviewLogo(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "logo" && form.logo) {
          formData.append("logo", form.logo);
        } else if (key !== "logo") {
          formData.append(key, form[key]);
        }
      });

      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        toast.success("✅ Footer updated successfully!");
      } else {
        await axios.post(API, formData);
        toast.success("✅ Footer added successfully!");
      }

      setForm({
        tagline: "",
        address: "",
        phone: "",
        email: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        logo: null,
      });
      setPreviewLogo(null);
      setEditingId(null);
      fetchFooter();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("❌ Failed to submit footer data.");
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, logo: null });
    setPreviewLogo(`data:image/png;base64,${item.logo}`);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this footer?")) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success("🗑️ Footer deleted.");
        fetchFooter();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("❌ Failed to delete footer.");
      }
    }
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Footer Management
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { name: "tagline", placeholder: "Tagline" },
            { name: "address", placeholder: "Address" },
            { name: "phone", placeholder: "Phone" },
            { name: "email", placeholder: "Email" },
            { name: "facebook", placeholder: "Facebook URL" },
            { name: "instagram", placeholder: "Instagram URL" },
            { name: "linkedin", placeholder: "LinkedIn URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.placeholder}
              </label>
              <input
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            />
            {previewLogo && (
              <img
                loading="lazy"
                src={previewLogo}
                alt="Logo Preview"
                className="mt-3 w-24 h-12 object-contain rounded-md"
              />
            )}
            {form.logo && (
              <p className="text-sm text-gray-600 mt-2">Selected: {form.logo.name}</p>
            )}
          </div>

          <button
            type="submit"
            className={`md:col-span-2 py-2 rounded-md font-semibold text-white ${
              editingId
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors duration-200`}
          >
            {editingId ? "Update Footer" : "Add Footer"}
          </button>
        </form>

        {/* Footer Cards */}
        {footer.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No footer data available.</p>
        ) : (
          <div className="space-y-4">
            {footer.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">{item.tagline}</p>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  <p className="text-sm text-gray-600">{item.phone} | {item.email}</p>
                  <div className="text-sm text-blue-600 space-x-4 mt-2">
                    {item.facebook && (
                      <a href={item.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Facebook
                      </a>
                    )}
                    {item.instagram && (
                      <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Instagram
                      </a>
                    )}
                    {item.linkedin && (
                      <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    )}
                  </div>
                  {item.logo && (
                    <img
                      loading="lazy"
                      src={`data:image/png;base64,${item.logo}`}
                      alt="Footer Logo"
                      className="mt-3 w-24 h-12 object-contain rounded-md"
                    />
                  )}
                </div>
                <div className="flex gap-2">
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

export default FooterCrud;
