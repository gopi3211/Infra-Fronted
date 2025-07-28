import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ContactUsPage = () => {
  const [info, setInfo] = useState({});
  const [bannerUrl, setBannerUrl] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    fetchInfo();
    fetchBanner();
  }, []);

  const fetchInfo = async () => {
    const res = await axiosInstance.get("/contact/info");
    setInfo(res.data);
  };

  const fetchBanner = async () => {
    const res = await axiosInstance.get("/contact/banner", { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    setBannerUrl(url);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/contact/submit", form);
    alert("Message sent successfully!");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div>
      {bannerUrl && (
        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${bannerUrl})` }} />
      )}

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-2">{info.title}</h2>
        <p className="mb-6">{info.subtext}</p>

        <div className="grid md:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full border p-2" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border p-2" />
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="w-full border p-2" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required className="w-full border p-2 h-32" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
          </form>

          <div>
            <h4 className="font-semibold mb-2">Contact Info</h4>
            <p><strong>Address:</strong> {info.address}</p>
            <p><strong>Phone:</strong> {info.phone}</p>
            <p><strong>Email:</strong> {info.email}</p>

            <div className="mt-4" dangerouslySetInnerHTML={{ __html: info.map_iframe }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
