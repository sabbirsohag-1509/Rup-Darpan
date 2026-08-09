import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home/Home";
import AddPhoto from "../pages/AddPhoto/AddPhoto";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import PrivateRoute from "../pages/Authentication/PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardPlaceholderPage from "../pages/Dashboard/DashboardPlaceholderPage";
import AdminRouter from "./AdminRouter/AdminRouter";
import AdminPhotosManagement from "../pages/Dashboard/AdminPhotosManagement";
import AdminUsersManagement from "../pages/Dashboard/AdminUsersManagement";
import AdminPackageManagement from "../pages/Dashboard/AdminPackageManagement";
import AddPackage from "../pages/AddPackage/AddPackage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Gallery from "../components/Gallery/Gallery";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Packages from "../components/Packages/Packages";
import PackagesDetails from "../components/Packages/PackagesDetails";
import Booking from "../components/Booking/Booking";
import MyBookings from "../components/Booking/MyBookings/MyBookings";
import AdminBookingManagement from "../pages/Dashboard/AdminBookingManagement";
import AdminReviewManagement from "../pages/Dashboard/AdminReviewManagement";
import MyReview from "../components/Review/MyReview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/packages",
        element: <Packages></Packages>,
      },
      {
        path: "/packages/:id",
        element: <PackagesDetails></PackagesDetails>,
      },
      {
        path: "/booking",
        element: <PrivateRoute><Booking></Booking></PrivateRoute>,
      },
    ],
  },
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
  //User Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
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
            element: <MyBookings />
          }
        ]
      },
      {
        path: "reviews",
        children: [
          {
            index: true,
            element: <MyReview></MyReview>
          },
        ],
      },
      {
        path: "profile",
        element: (
          <DashboardPlaceholderPage
            title="Profile"
            description="Profile management UI is ready to connect with your backend."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <DashboardPlaceholderPage
            title="Settings"
            description="User preference controls can be connected in this section."
          />
        ),
      },
    ],
  },
  //Admin Dashboard Routes
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
        path: "bookings",
        children: [
          {
            index: true,
            element:<AdminBookingManagement></AdminBookingManagement>
          },
        ]
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
        path: "users",
        children: [
          {
            index: true,
            element: <AdminUsersManagement></AdminUsersManagement>,
          },
        ],
      },
      {
        path: "packages",
        children: [
          {
            index: true,
            element: <AdminPackageManagement></AdminPackageManagement>,
          },
          {
            path: "add-package",
            element: <AddPackage></AddPackage>,
          },
        ],
      },
      {
        path: "reviews",
        children: [ 
          {
            index: true,
            element: <AdminReviewManagement /> 
          },
        ],
      },
      {
        path: "payments",
        element: (
          <DashboardPlaceholderPage
            title="Payments Management"
            description="Payment operations and settlements panel is ready."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <DashboardPlaceholderPage
            title="Admin Settings"
            description="Platform-level admin preferences and controls belong here."
          />
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);
