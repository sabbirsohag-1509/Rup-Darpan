import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const routeMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your photography experience.",
  },
  "/dashboard/bookings": {
    title: "My Bookings",
    description: "Track and manage your photography sessions.",
  },
  "/dashboard/reviews": {
    title: "Reviews",
    description: "Manage feedback and testimonials.",
  },
  "/dashboard/profile": {
    title: "Profile",
    description: "Manage your personal information.",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Update your dashboard preferences.",
  },
  "/admin/users": {
    title: "Users",
    description: "View and manage platform users.",
  },
  "/admin/bookings": {
    title: "Bookings",
    description: "Monitor and manage all bookings.",
  },
  "/admin/photos": {
    title: "Photos",
    description: "Manage your Image and gallery assets.",
  },
   "/admin/videos": {
    title: "Videos",
    description: "Manage your Video and gallery assets.",
  },
  "/admin/packages": {
    title: "Packages",
    description: "Maintain photography package offerings.",
  },
  "/admin/reviews": {
    title: "Reviews",
    description: "Moderate and analyze customer feedback.",
  },
  "/admin/payments": {
    title: "Payments",
    description: "Track payments and revenue activity.",
  },
  "/admin/settings": {
    title: "Admin Settings",
    description: "Configure platform-level settings.",
  },
};

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const headerMeta = useMemo(
    () =>
      routeMeta[location.pathname] || {
        title: "Dashboard",
        description: "Manage your Rup Darpon workspace.",
      },
    [location.pathname],
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base-200/40 text-base-content">
      <div className="shrink-0"> 
        <DashboardHeader
        title={headerMeta.title}
        description={headerMeta.description}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
