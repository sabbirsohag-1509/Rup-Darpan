
import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const routeMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Rup Darpon-এর সাথে আপনার অভিজ্ঞতার সংক্ষিপ্ত চিত্র",
  },

  "/dashboard/bookings": {
    title: "My Bookings",
  },

  "/dashboard/reviews": {
    title: "My Reviews",
  },

  "/dashboard/profile": {
    title: "My Profile",
  },


  // ================= ADMIN =================

  "/admin/users": {
    title: "Users Management",
  },

  "/admin/bookings": {
    title: "Bookings Management",
  },

  "/admin/photos": {
    title: "Photos & Galleries Management",
  },

  "/admin/videos": {
    title: "Videos & Galleries Management",
  },

  "/admin/hero-images": {
    title: "Hero Images Management",
  },

  "/admin/packages": {
    title: "Packages Management",
  },

  "/admin/reviews": {
    title: "Reviews Management",
  },

  "/admin/payments": {
    title: "Payments & Revenue Activity Tracking",
  },

};

const DashboardLayout = () => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================================================
  // CURRENT ROUTE META
  // =========================================================

  const headerMeta = useMemo(() => {
    return (
      routeMeta[location.pathname] || {
        title: "Dashboard",
        description: "Rup Darpon-এর সার্বিক কার্যক্রম ও ব্যবস্থাপনা",
      }
    );
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-base-200/40 text-base-content">
      {/* =====================================================
          LEFT SIDEBAR
          NO CHANGE
      ===================================================== */}

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          RIGHT SIDE
          HEADER + CONTENT
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ===================================================
            DASHBOARD HEADER
        =================================================== */}

        <div className="shrink-0">
          <DashboardHeader
            title={headerMeta.title}
            description={headerMeta.description}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
