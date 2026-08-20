import { createBrowserRouter } from "react-router";

import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";

import Home from "../pages/Home/Home/Home";
import Gallery from "../components/Gallery/Gallery";
import GalleryPhotos from "../components/Gallery/GalleryPhotos/GalleryPhotos";
import GalleryVideos from "../components/Gallery/GalleryVideos/GalleryVideos";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Packages from "../components/Packages/Packages";
import PackagesDetails from "../components/Packages/PackagesDetails";
import Booking from "../components/Booking/Booking";

import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import PrivateRoute from "../pages/Authentication/PrivateRoute";

import UserRouter from "./UserRouter/UserRouter";
import AdminRouter from "./AdminRouter/AdminRouter";

import Dashboard from "../pages/Dashboard/Dashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import DashboardPlaceholderPage from "../pages/Dashboard/DashboardPlaceholderPage";

import MyBookings from "../components/Booking/MyBookings/MyBookings";
import MyReview from "../components/Review/MyReview";

import UserProfile from "../pages/Dashboard/MyProfile/UserProfile";
import AdminProfile from "../pages/Dashboard/MyProfile/AdminProfile";

import AdminBookingManagement from "../pages/Dashboard/AdminBookingManagement";
import AdminPhotosManagement from "../pages/Dashboard/AdminPhotosManagement";
import AdminVideosManagement from "../pages/Dashboard/AdminVideosManagement";
import AdminUsersManagement from "../pages/Dashboard/AdminUsersManagement";
import AdminPackageManagement from "../pages/Dashboard/AdminPackageManagement";
import AdminReviewManagement from "../pages/Dashboard/AdminReviewManagement";

import AddPhoto from "../pages/AddPhoto/AddPhoto";
import AddVideo from "../pages/AddVideo/AddVideo";
import AddPackage from "../pages/AddPackage/AddPackage";
import AddHeroImage from "../pages/AddHeroImage/AddHeroImage";

import AdminHeroImageManagement from "../pages/Dashboard/AdminHeroImageManagement/AdminHeroImageManagement";

import ErrorPage from "../components/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "gallery",
        element: <Gallery />,
      },

      {
        path: "gallery/photos",
        element: <GalleryPhotos />,
      },

      {
        path: "gallery/videos",
        element: <GalleryVideos />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "contact",
        element: <Contact />,
      },

      {
        path: "packages",
        element: <Packages />,
      },

      {
        path: "packages/:id",
        element: <PackagesDetails />,
      },

      {
        path: "booking",
        element: (
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        ),
      },
    ],
  },

  // =====================================================
  // AUTH ROUTES
  // =====================================================
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // =====================================================
  // USER DASHBOARD ROUTES
  // =====================================================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <UserRouter>
          <DashboardLayout />
        </UserRouter>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "bookings",
        children: [
          {
            index: true,
            element: <MyBookings />,
          },
        ],
      },
      {
        path: "reviews",
        children: [
          {
            index: true,
            element: <MyReview />,
          },
        ],
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: <UserProfile />,
          },
        ],
      },
    ],
  },

  // =====================================================
  // ADMIN DASHBOARD ROUTES
  // =====================================================
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminRouter>
          <DashboardLayout />
        </AdminRouter>
      </PrivateRoute>
    ),

    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "bookings",
        children: [
          {
            index: true,
            element: <AdminBookingManagement />,
          },
        ],
      },
      {
        path: "photos",
        children: [
          {
            index: true,
            element: <AdminPhotosManagement />,
          },
          {
            path: "add-photos",
            element: <AddPhoto />,
          },
        ],
      },
      {
        path: "hero-images",
        children: [
          {
            index: true,
            element: <AdminHeroImageManagement />,
          },
          {
            path: "add-hero-photos",
            element: <AddHeroImage />,
          },
        ],
      },
      {
        path: "videos",
        children: [
          {
            index: true,
            element: <AdminVideosManagement />,
          },
          {
            path: "add-videos",
            element: <AddVideo />,
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: <AdminUsersManagement />,
          },
        ],
      },
      {
        path: "packages",
        children: [
          {
            index: true,
            element: <AdminPackageManagement />,
          },
          {
            path: "add-package",
            element: <AddPackage />,
          },
        ],
      },
      {
        path: "reviews",
        children: [
          {
            index: true,
            element: <AdminReviewManagement />,
          },
        ],
      },
      {
        path: "payments",
        element: (
          <DashboardPlaceholderPage
            title="Payments Management"
            description="Payment Method Under Construction."
          />
        ),
      },
      {
        path: "admin-profile",
        children: [
          {
            index: true,
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);