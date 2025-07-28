import React, { useEffect, useState } from "react";
import {
  getAllNews,
  createNews,
  deleteNews,
  uploadBanner,
  getBanner,
} from "../../../services/newsService";

const NewsCrud = () => {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    full_description: "",
    posted_date: "",
    images: [],
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      setNewsList(res.data.data);
    } catch (err) {
      console.error("Fetch news error:", err);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return;
    const formData = new FormData();
    formData.append("banner", bannerFile);
    try {
      await uploadBanner(formData);
      alert("Banner uploaded");
    } catch (err) {
      console.error("Upload banner error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (key !== "images") formData.append(key, form[key]);
    }
    for (const img of form.images) {
      formData.append("images", img);
    }

    try {
      await createNews(formData);
      setForm({
        title: "",
        short_description: "",
        full_description: "",
        posted_date: "",
        images: [],
      });
      fetchNews();
    } catch (err) {
      console.error("Create news error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      fetchNews();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    (async () => {
      try {
        const banner = await getBanner();
        const mime = banner.headers["content-type"];
        const blob = new Blob([banner.data], { type: mime });
        const url = URL.createObjectURL(blob);
        setBannerPreview(`${url}?t=${Date.now()}`);
      } catch (err) {
        console.error("Banner load error:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">News & Updates CRUD</h2>

        {/* Banner Upload */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">News Banner</h3>
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full max-w-2xl h-60 object-cover rounded-lg border border-gray-200 shadow"
            />
          )}
          <div className="mt-3 flex gap-3 items-center">
            <input
              type="file"
              onChange={handleBannerChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleUploadBanner}
              className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Add News Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-4 py-2 rounded bg-white text-gray-900 placeholder-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Short Description"
            value={form.short_description}
            onChange={(e) =>
              setForm({ ...form, short_description: e.target.value })
            }
            className="w-full border px-4 py-2 rounded bg-white text-gray-900 placeholder-gray-400"
            required
          />
          <textarea
            placeholder="Full Description"
            value={form.full_description}
            onChange={(e) =>
              setForm({ ...form, full_description: e.target.value })
            }
            className="w-full border px-4 py-3 rounded bg-white text-gray-900 placeholder-gray-400 resize-none"
            rows={5}
            required
          />
          <input
            type="date"
            value={form.posted_date}
            onChange={(e) =>
              setForm({ ...form, posted_date: e.target.value })
            }
            className="w-full border px-4 py-2 rounded bg-white text-gray-900"
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) =>
              setForm({ ...form, images: Array.from(e.target.files) })
            }
            className="w-full border px-4 py-2 rounded text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Add News
          </button>
        </form>
      </div>

      {/* All News Display */}
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All News Entries</h3>
        {newsList.length === 0 ? (
          <p className="text-gray-500 text-center">No news added yet.</p>
        ) : (
          <div className="space-y-4">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.short_description}</p>
                  <p className="text-sm text-gray-500 mt-1">📅 {item.posted_date}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 sm:mt-0 bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCrud;
