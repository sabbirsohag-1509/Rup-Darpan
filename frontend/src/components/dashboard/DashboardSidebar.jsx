import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import {
  Camera,
  CreditCard,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Package,
  Settings,
  User,
  Users,
  X,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../shared/Logo";
import { AuthContext } from "../../context/AuthContext";

const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: CalendarDays },
  { to: "/dashboard/reviews", label: "My Reviews", icon: MessageSquareText },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },

  { to: "/admin/photos", label: "Photos", icon: Image },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  {to: "/admin/admin-profile", label: "Profile", icon: User },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const navClass = ({ isActive }) =>
  [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
    isActive
      ? "border border-primary/20 bg-primary/10 text-primary"
      : "text-base-content/80 hover:border hover:border-primary/15 hover:bg-base-200 hover:text-primary",
  ].join(" ");

const DashboardSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const links = user?.role === "admin" ? adminLinks : userLinks;

  const closeAll = () => {
    onClose();
    setLogoutModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen min-h-0 w-[280px] flex-col border-r border-primary/10 bg-base-100 p-4 shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-full lg:translate-x-0 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" onClick={onClose}>
            <Logo compact />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label="Close dashboard menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/10 bg-base-200/60 px-3 py-2 text-xs uppercase tracking-widest text-primary">
          <Camera className="h-3.5 w-3.5" />
          Dashboard
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={navClass}
              onClick={onClose}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto shrink-0 pt-4">
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-content"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-primary/30 bg-base-100/90 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="font-playfair text-2xl font-semibold">Logout?</h3>
              <p className="mt-2 text-sm text-base-content/65">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="btn btn-ghost flex-1 border border-base-content/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  logout()
                    .then(() => {
                      closeAll();
                      toast.success("Logged out successfully!");
                    })
                    .catch((error) => {
                      console.error("Logout error:", error);
                      toast.error("Failed to log out. Please try again.");
                    });
                }}
                className="btn btn-primary flex-1 text-primary-content"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
