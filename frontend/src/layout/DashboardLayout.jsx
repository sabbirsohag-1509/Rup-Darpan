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
    description: "Manage portfolio and gallery assets.",
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
    <div className="min-h-screen overflow-x-hidden bg-base-200/40 text-base-content">
      <DashboardHeader
        title={headerMeta.title}
        description={headerMeta.description}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="mx-auto flex w-full max-w-[1600px] gap-4 px-3 py-4 sm:px-4 lg:px-6">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;