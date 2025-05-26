import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Directory from './pages/Directory';
import FisheryDetail from './pages/FisheryDetail';
import Accommodation from './pages/Accommodation';
import TackleShops from './pages/TackleShops';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFisheries from './pages/admin/Fisheries';
import AdminLakes from './pages/admin/Lakes';
import AdminAccommodation from './pages/admin/Accommodation';
import AdminTackleShops from './pages/admin/TackleShops';
import AdminMessages from './pages/admin/Messages';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const location = useLocation();

  // Hide footer on /login and any route that starts with /admin
  const hideFooter =
    location.pathname === '/login' ||
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/');

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="directory" element={<Directory />} />
            <Route path="directory/:slug" element={<FisheryDetail />} />
            <Route path="accommodation" element={<Accommodation />} />
            <Route path="tackle-shops" element={<TackleShops />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="fisheries" element={<AdminFisheries />} />
              <Route path="lakes" element={<AdminLakes />} />
              <Route path="accommodation" element={<AdminAccommodation />} />
              <Route path="tackle-shops" element={<AdminTackleShops />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {/* Only show Footer if not on login or any admin route */}
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}