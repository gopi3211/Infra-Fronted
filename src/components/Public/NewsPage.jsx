import React, { useEffect, useState } from "react";
import { getAllNews, getBanner, getNewsById } from "../../services/newsService";
import Footer from "../Home/Footer";

const NewsPage = () => {
  const [banner, setBanner] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [modal, setModal] = useState({ open: false, content: null });

  const [hasFetched, setHasFetched] = useState(false);
  const [modalCache, setModalCache] = useState({});

  useEffect(() => {
    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  const fetchData = async () => {
    try {
      const newsRes = await getAllNews();
      setNewsList(newsRes.data.data);

      const bannerRes = await getBanner();
      const mime = bannerRes.headers["content-type"];
      const blob = new Blob([bannerRes.data], { type: mime });
      const imageURL = URL.createObjectURL(blob);
      setBanner(`${imageURL}?t=${Date.now()}`);

      setHasFetched(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const openModal = async (id) => {
    if (modalCache[id]) {
      setModal({ open: true, content: modalCache[id] });
      return;
    }

    try {
      const res = await getNewsById(id);
      setModalCache((prev) => ({ ...prev, [id]: res.data.data }));
      setModal({ open: true, content: res.data.data });
    } catch (err) {
      console.error("Error opening modal:", err);
    }
  };

  const closeModal = () => setModal({ open: false, content: null });

  const blobToBase64 = (blob) => {
    try {
      return `data:image/jpeg;base64,${btoa(
        new Uint8Array(blob.data).reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          ""
        )
      )}`;
    } catch (err) {
      console.error("Error decoding image blob:", err);
      return "/default-image.jpg";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24">
      <main className="flex-grow">
        {/* Top News Banner */}
        {banner && (
          <img
            src={banner}
            alt="News Banner"
            className="w-full h-64 object-cover shadow mb-10"
          />
        )}

        {/* News Cards */}
        <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white shadow-lg border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* 🖼️ Thumbnail Grid */}
              <div className="grid grid-cols-2 gap-1 h-40 overflow-hidden">
                {news.images && news.images.length > 0 ? (
                  news.images.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={blobToBase64(img.image_blob)}
                      alt={`thumbnail-${i}`}
                      className="w-full h-full object-cover"
                    />
                  ))
                ) : (
                  <img
                    src="/default-image.jpg"
                    alt="default"
                    className="col-span-2 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Text */}
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {news.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {news.short_description}
                  </p>
                  <p className="text-xs text-gray-500">
                    📅 {new Date(news.posted_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => openModal(news.id)}
                  className="mt-4 w-fit px-4 py-2 text-sm font-medium bg-lime-600 text-white rounded hover:bg-lime-700 transition"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full mt-auto">
        <Footer />
      </footer>

      {/* 📖 Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full relative max-h-[90vh] shadow-2xl">
            <img
              src={
                modal.content?.images?.length > 0
                  ? blobToBase64(modal.content.images[0].image_blob)
                  : "/default-image.jpg"
              }
              alt="modal-news-banner"
              className="w-full h-60 object-cover"
            />

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
              <button
                onClick={closeModal}
                className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-lime-700 mb-2">
                {modal.content?.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                📅 {new Date(modal.content?.posted_date).toLocaleDateString()}
              </p>
              <p className="text-base text-gray-800 whitespace-pre-line mb-4">
                {modal.content?.full_description}
              </p>

              {/* Additional Images */}
              {modal.content?.images?.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {modal.content.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={blobToBase64(img.image_blob)}
                      alt={`news-img-${idx + 1}`}
                      className="w-full h-48 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
