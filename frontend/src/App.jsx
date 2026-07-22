import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Booking from './pages/Booking.jsx'
import Payment from './pages/Payment.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import OrganizerDashboard from './pages/OrganizerDashboard.jsx'
import Team from './pages/Team.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import OtpVerification from './pages/auth/OtpVerification.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <RecentlyViewedProvider>
            <BookingProvider>
              <ToastProvider>
                <div className="flex min-h-screen flex-col">
                  <ScrollToTop />
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:id" element={<EventDetail />} />
                      <Route path="/events/:id/book" element={<Booking />} />
                      <Route path="/events/:id/payment" element={<Payment />} />
                      <Route path="/bookings" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/bookings/:bookingId/confirmation" element={<Confirmation />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/organizer" element={<OrganizerDashboard />} />
                      <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/verify-otp" element={<OtpVerification />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ToastProvider>
            </BookingProvider>
          </RecentlyViewedProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
