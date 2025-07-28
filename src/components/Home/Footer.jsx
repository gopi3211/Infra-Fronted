import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL + "/home/footer";

const Footer = () => {
  const [footer, setFooter] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true);
          axios
            .get(API)
            .then((res) => {
              if (res.data?.data) setFooter(res.data.data);
            })
            .catch((err) => console.error("Footer fetch failed:", err));
        }
      },
      { threshold: 0.2 }
    );

    const current = footerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasFetched]);

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-tr from-[#1e1f2b] to-[#111219] text-white pt-16 pb-8 px-6 md:px-20 font-sans"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-start">
          {footer?.logo && (
            <img
              src={`data:image/png;base64,${footer.logo}`}
              alt="HPR Infra Logo"
              className="h-24 w-auto mb-4 rounded-lg shadow-sm"
              loading="lazy"
            />
          )}
          <p className="text-sm text-gray-300 leading-relaxed">
            {footer?.tagline || "Transforming infrastructure with trust."}
          </p>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Address</h4>
          <p className="text-sm leading-6 whitespace-pre-line text-gray-300">
            {footer?.address || "Loading address..."}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p className="text-sm flex items-center gap-2 text-gray-300">
            <FaPhoneAlt className="text-[#56CCF2]" />
            {footer?.phone || "Loading..."}
          </p>
          <p className="text-sm flex items-center gap-2 mt-2 text-gray-300">
            <FaEnvelope className="text-[#56CCF2]" />
            {footer?.email ? (
              <a
                href={`mailto:${footer.email}`}
                className="hover:text-white underline transition"
              >
                {footer.email}
              </a>
            ) : (
              "Loading..."
            )}
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
          <div className="flex gap-4 text-xl">
            {footer?.facebook && (
              <a
                href={footer.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#56CCF2] transition"
              >
                <FaFacebookF />
              </a>
            )}
            {footer?.instagram && (
              <a
                href={footer.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E1306C] transition"
              >
                <FaInstagram />
              </a>
            )}
            {footer?.linkedin && (
              <a
                href={footer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0e76a8] transition"
              >
                <FaLinkedinIn />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 mt-6">
        <p>© {new Date().getFullYear()} HPR Infra LLP. All rights reserved.</p>
        <a
          href="#"
          className="hover:text-white mt-2 md:mt-0 transition underline underline-offset-2"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
