import axiosInstance from "../utils/axiosInstance";

// -------------------- PROJECTS MAIN --------------------
export const createProject = (data) => axiosInstance.post(`/hpr-projects`, data);
export const getAllProjects = () => axiosInstance.get(`/hpr-projects`);
export const getProjectById = (id) => axiosInstance.get(`/hpr-projects/${id}`);
export const updateProject = (id, data) => axiosInstance.put(`/hpr-projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/hpr-projects/${id}`);

// -------------------- UTILITIES --------------------
export const getProjectNames = () => axiosInstance.get(`/hpr-projects/names`);
export const getGalleryByCategory = (category) => axiosInstance.get(`/hpr-projects/gallery-category/${category}`);

// -------------------- HOME TAB --------------------
export const createHome = (data) => axiosInstance.post(`/hpr-projects/home`, data);
export const getHomeByProjectId = (projectId) => axiosInstance.get(`/hpr-projects/home/${projectId}`);
export const updateHome = (id, data) => axiosInstance.put(`/hpr-projects/home/${id}`, data);
export const deleteHome = (id) => axiosInstance.delete(`/hpr-projects/home/${id}`);

// -------------------- GALLERY TAB --------------------
export const addGalleryImage = (data) => axiosInstance.post(`/hpr-projects/gallery`, data);
export const getGalleryByProjectId = (projectId) => axiosInstance.get(`/hpr-projects/gallery/${projectId}`);
export const deleteGalleryImage = (id) => axiosInstance.delete(`/hpr-projects/gallery/${id}`);

// -------------------- PLAN TAB --------------------
export const addPlan = (data) => axiosInstance.post(`/hpr-projects/plan`, data);
export const getPlanByProjectId = (projectId) => axiosInstance.get(`/hpr-projects/plan/${projectId}`);
export const updatePlan = (id, data) => axiosInstance.put(`/hpr-projects/plan/${id}`, data);
export const deletePlan = (id) => axiosInstance.delete(`/hpr-projects/plan/${id}`);


// -------------------- LOCATION --------------------
export const addLocation = (data) =>
  axiosInstance.post(`/hpr-projects/location`, data);

export const getLocationByProjectId = (projectId) =>
  axiosInstance.get(`/hpr-projects/location/${projectId}`);

export const updateLocation = (id, data) =>
  axiosInstance.put(`/hpr-projects/location/${id}`, data);

export const deleteLocation = (id) =>
  axiosInstance.delete(`/hpr-projects/location/${id}`);



export const createAmenities = (data) => axiosInstance.post(`/hpr-projects/amenities`, data);
export const getAmenitiesByProjectId = (projectId) => axiosInstance.get(`/hpr-projects/amenities/${projectId}`);
export const updateAmenities = (id, data) => axiosInstance.put(`/hpr-projects/amenities/${id}`, data);
export const deleteAmenities = (id) => axiosInstance.delete(`/hpr-projects/amenities/${id}`);

// -------------------- CONTACT FORM --------------------
export const submitContactForm = (data) => axiosInstance.post(`/hpr-projects/contact`, data);
