import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import Navbar from './components/Home/Navbar';
import HeroCarousel from './components/Home/HeroCarousel';
import MissionStatement from './components/Home/MissionStatement';
import ProjectsSection from './components/Home/ProjectsSection';
import CompanyValuesSection from './components/Home/CompanyValuesSection';
import TestimonialCarousel from './components/Home/TestimonialCarousel';
import Footer from './components/Home/Footer';

import HeroCarouselCrud from './components/Admin/HomeSectionCrud/HeroCarouselCrud';
import MissionStatementCrud from './components/Admin/HomeSectionCrud/MissionStatementCrud';
import ProjectsSectionCrud from './components/Admin/HomeSectionCrud/ProjectsSectionCrud';

import AdminLoginPage from './components/Admin/AdminLoginPage';
import AdminRegisterPage from './components/Admin/AdminRegisterPage';
import AdminVerifyOtpPage from './components/Admin/AdminVerifyOtpPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';

import CompanyValuesCrud from './components/Admin/HomeSectionCrud/CompanyValuesCrud';
import TestimonialsCrud from './components/Admin/HomeSectionCrud/TestimonialsCrud';
import FooterCrud from './components/Admin/HomeSectionCrud/FooterCrud';

import AboutUsPage from './components/AboutUs/AboutUsPage';
import AboutUsPageCrud from './components/Admin/HomeSectionCrud/AboutUsPageCrud';
import AboutUsSubsectionCrud from './components/Admin/HomeSectionCrud/AboutUsSubsectionCrud';
import PartnersCrud from './components/Admin/HomeSectionCrud/PartnersCrud';

import HPRProjectsPublicPage from "./components/Public/HPRProjectsPublicPage";
import ProjectDetailsPage from "./components/Public/ProjectDetailsPage";
import HPRProjectsCrudPage from "./components/Admin/HomeSectionCrud/HPRProjectsCrudPage";

import GalleryPage from './components/Public/GalleryPage';
import NewsCrud from './components/Admin/HomeSectionCrud/NewsCrud';
import NewsPage from './components/Public/NewsPage';

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <Navbar />

  <ToastContainer
    position="bottom-right"
    autoClose={2000}
    hideProgressBar={true}
    toastClassName="text-sm rounded shadow-md"
    limit={1}
  />



<div className="pt-20 sm:pt-24 bg-[#f9fafb] text-gray-900 min-h-screen font-sans">
        <Routes>
          {/* 🌐 Public Home Page */}
          <Route
            path="/"
            element={
              <div className="w-full overflow-x-hidden">
                <div className="mb-16">
                  <HeroCarousel />
                </div>
                <div className="mb-16">
                  <MissionStatement />
                </div>
                <div id="projects" className="mb-16">
                  <ProjectsSection />
                </div>
                <div className="mb-16">
                  <CompanyValuesSection />
                </div>
                <div className="mb-16">
                  <TestimonialCarousel />
                </div>
                <Footer />
              </div>
            }
          />

          {/* ✅ News Page (Public) */}
          <Route path="/news" element={<NewsPage />} />

          {/* ✅ Public Pages */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/projects" element={<HPRProjectsPublicPage />} />
          <Route path="/project-details/:id" element={<ProjectDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />

          {/* 🔐 Auth Pages */}
          {!isAuthenticated && (
            <>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/register" element={<AdminRegisterPage />} />
              <Route path="/admin/verify-otp" element={<AdminVerifyOtpPage />} />
            </>
          )}

          {/* 🛠️ Admin CRUD Section (Protected) */}
          <Route
            path="/admin/home/crud"
            element={
              <ProtectedRoute>
                <div className="bg-white min-h-screen px-6 py-10 space-y-16">
                  <HeroCarouselCrud />
                  <MissionStatementCrud />
                  <ProjectsSectionCrud />
                  <CompanyValuesCrud />
                  <TestimonialsCrud />
                  <FooterCrud />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 📂 Admin Section Routes */}
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute>
                <AboutUsPageCrud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/about/subsections"
            element={
              <ProtectedRoute>
                <AboutUsSubsectionCrud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <HPRProjectsCrudPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/partners"
            element={
              <ProtectedRoute>
                <PartnersCrud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <NewsCrud />
              </ProtectedRoute>
            }
          />

          {/* 📊 Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
