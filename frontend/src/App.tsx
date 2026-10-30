import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProgressBar } from "./components/common/ProgressBar";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { NotFoundPage } from "./pages/public/NotFoundPage";
import HomePage from "./pages/public/HomePage";
import ProjectDetailPage from "./pages/public/ProjectDetailPage";

// Admin pages (lazy loaded)
const LoginPage = lazy(() => import("./pages/admin/LoginPage").then(m => ({ default: m.LoginPage })));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage").then(m => ({ default: m.DashboardPage })));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile").then(m => ({ default: m.AdminProfile })));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects").then(m => ({ default: m.AdminProjects })));
const AdminCertificates = lazy(() => import("./pages/admin/AdminCertificates").then(m => ({ default: m.AdminCertificates })));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience").then(m => ({ default: m.AdminExperience })));
const AdminEducation = lazy(() => import("./pages/admin/AdminEducation").then(m => ({ default: m.AdminEducation })));
const AdminSkills = lazy(() => import("./pages/admin/AdminSkills").then(m => ({ default: m.AdminSkills })));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages").then(m => ({ default: m.AdminMessages })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Loading spinner for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 rounded-full border-4 border-majorelle/30 border-t-majorelle animate-spin" />
  </div>
);

// Public Layout
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-light text-ink dark:bg-canvas-dark dark:text-ink-dark transition-colors duration-200">
      <ProgressBar />
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout and Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            </Route>

            {/* Admin Login Route (standalone) */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <LoginPage />
                </Suspense>
              }
            />

            {/* Admin Protected Dashboard Routes */}
            <Route
              path="/admin"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col bg-canvas-light text-ink dark:bg-canvas-dark dark:text-ink-dark">
                  <Navbar />
                  <main className="flex-grow pt-20">
                    <NotFoundPage />
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
