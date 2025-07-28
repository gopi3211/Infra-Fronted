import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const API = import.meta.env.VITE_API_BASE_URL + "/home/testimonials";

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          setLoading(true);
          axios
            .get(API)
            .then((res) => {
              setTestimonials(res.data?.data || []);
            })
            .catch((err) =>
              console.error("Failed to fetch testimonials:", err)
            )
            .finally(() => setLoading(false));
        }
      },
      { threshold: 0.2 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasFetched]);

  return (
    <div
      ref={sectionRef}
      className="relative py-16 bg-gradient-to-r from-[#ECFBF3] via-[#DFF4FF] to-[#ECFBF3]"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-10 text-4xl font-bold text-[#567D46]">
          What Our Clients Say
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500">
            No testimonials available.
          </p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            loop={true}
            className="max-w-3xl mx-auto"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition duration-500 text-center py-10 px-6 mx-4">
                  <img
                    src={
                      t.image
                        ? `data:image/jpeg;base64,${t.image}`
                        : "/default-avatar.png"
                    }
                    alt={t.name}
                    className="mx-auto rounded-full border-4 border-green-400 shadow-md mb-6"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                  <h5 className="text-xl font-bold mb-2 text-[#017DB9]">
                    {t.name}
                  </h5>
                  <p className="text-gray-700 text-md">{t.message}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
