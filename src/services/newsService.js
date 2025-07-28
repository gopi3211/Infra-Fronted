// ✅ src/services/newsService.js
import axiosInstance from "../utils/axiosInstance";

export const getAllNews = () => axiosInstance.get("/news");
export const getNewsById = (id) => axiosInstance.get(`/news/${id}`);
export const createNews = (data) => axiosInstance.post("/news", data);
export const updateNews = (id, data) => axiosInstance.put(`/news/${id}`, data);
export const deleteNews = (id) => axiosInstance.delete(`/news/${id}`);

export const uploadBanner = (formData) => axiosInstance.post("/news/banner", formData);
export const getBanner = () => axiosInstance.get("/news/banner", { responseType: 'blob' });
