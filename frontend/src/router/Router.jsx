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
        path: "add-photo",
        element: (
          <PrivateRoute>
            <AddPhoto />
          </PrivateRoute>
        ),
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
        element: (
          <DashboardPlaceholderPage
            title="My Bookings"
            description="Your booking management section is ready for API integration."
          />
        ),
      },
      {
        path: "reviews",
        element: (
          <DashboardPlaceholderPage
            title="Reviews"
            description="Your review management section is prepared for real data."
          />
        ),
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
        path: "users",
        element: (
          <DashboardPlaceholderPage
            title="Users Management"
            description="Admin users management page is ready for API integration."
          />
        ),
      },
      {
        path: "bookings",
        element: (
          <DashboardPlaceholderPage
            title="Bookings Management"
            description="Admin booking operations UI is prepared for backend data."
          />
        ),
      },
      {
        path: "photos",
        element: <AdminPhotosManagement />,
      },
      {
        path: "packages",
        element: (
          <DashboardPlaceholderPage
            title="Packages Management"
            description="Package administration interface is ready for API wiring."
          />
        ),
      },
      {
        path: "reviews",
        element: (
          <DashboardPlaceholderPage
            title="Reviews Moderation"
            description="Customer feedback moderation tools can be connected here."
          />
        ),
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
]);
