import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const API = import.meta.env.VITE_API_BASE_URL + "/hero-carousel";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setLoading(true);
          axios
            .get(API)
            .then((res) => {
              const formatted =
                res.data?.data?.map((slide) => {
                  const blob = new Blob([new Uint8Array(slide.image.data)], {
                    type: "image/jpeg",
                  });
                  return {
                    heading: slide.heading,
                    subheading: slide.subheading,
                    image: URL.createObjectURL(blob),
                  };
                }) || [];
              setSlides(formatted);
              setHasFetched(true);
            })
            .catch((err) => console.error("Error fetching slides", err))
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
    <div
      ref={sectionRef}
      className="w-full h-[100vh] relative bg-gray-100 flex items-center justify-center"
    >
      {loading ? (
        <div className="w-12 h-12 border-4 border-green-600 border-dashed rounded-full animate-spin" />
      ) : slides.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000 }}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full h-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4">
                  <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                    {slide.heading}
                  </h2>
                  <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
                    {slide.subheading}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : hasFetched ? (
        <div className="text-gray-500">No slides available.</div>
      ) : null}
    </div>
  );
};

export default HeroCarousel;
