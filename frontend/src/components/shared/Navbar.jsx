import { useState, useContext } from "react";
import { NavLink } from "react-router";
import {
  Home,
  Images,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Package,
  PlusSquare,
  Settings,
  Star,
  X,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const getNavLinks = () => {
  return [
    { to: "/", label: "Home", end: true, icon: Home },
    { to: "/gallery", label: "Gallery", icon: Images },
    { to: "/packages", label: "Packages", icon: Package },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];
};

const navLinkClass = ({ isActive }) =>
  [
    "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200",
    "hover:text-primary",
    isActive ? "text-primary font-semibold" : "text-base-content/70",
    "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary after:origin-left after:transition-transform after:duration-200",
    isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
  ].join(" ");

const mobileLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition-colors duration-200",
    isActive
      ? "bg-primary/10 text-primary font-semibold"
      : "text-base-content/80 hover:bg-base-200 hover:text-primary",
  ].join(" ");

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const navLinks = getNavLinks();

  const renderLinks = (className, onNavigate, iconSize = "h-4 w-4") =>
    navLinks.map(({ to, label, end, icon: Icon }) => (
      <li key={to}>
        <NavLink to={to} end={end} className={className} onClick={onNavigate}>
          <Icon className={iconSize} aria-hidden="true" />
          {label}
        </NavLink>
      </li>
    ));

  return (
    <nav
      className="navbar max-w-7xl mx-auto w-full px-4 lg:px-6 min-h-[4.25rem]"
      aria-label="Main navigation"
    >
      <div className="navbar-start gap-1">
        <div
          className={`dropdown lg:hidden ${menuOpen ? "dropdown-open" : ""}`}
        >
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-square"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[60] w-56 rounded-box border border-primary/10 bg-base-100 p-2 shadow-lg"
          >
            {renderLinks(mobileLinkClass, closeMenu, "h-4 w-4")}
            <li className="mt-1 border-t border-primary/10 pt-1 lg:hidden">
              <NavLink
                to="/login"
                className="btn btn-primary btn-sm w-full text-primary-content gap-2"
                onClick={closeMenu}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login
              </NavLink>
            </li>
          </ul>
        </div>

        <NavLink to="/" className="hover:opacity-90 transition-opacity">
          <Logo compact />
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {renderLinks(navLinkClass)}
        </ul>
      </div>

      <div className="navbar-end gap-1 sm:gap-2">
        <ThemeToggle />
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : user ? (
          <div className="relative">
            {/* Profile Photo */}
            <div className="tooltip tooltip-bottom" data-tip={user.name}>
              <button
                type="button"
                className="avatar cursor-pointer"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                <div className="w-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-content font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 z-[70] w-52 rounded-xl border border-primary/15 bg-base-100 p-2 shadow-xl">
                <NavLink
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </NavLink>

                <div className="my-1 border-t border-primary/10" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-primary btn-sm px-4 sm:px-5 font-semibold text-primary-content shadow-sm hover:shadow-md transition-shadow gap-1.5"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </NavLink>
        )}
      </div>
      <div>
        {logoutModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={() => setLogoutModalOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-primary/30 bg-base-100/90 p-6 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30">
                <LogOut className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-playfair text-2xl font-semibold">
                  Logout?
                </h3>

                <p className="mt-2 text-sm text-base-content/65">
                  Are you sure you want to log out of your account?
                </p>
              </div>

              {/* Buttons */}
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
                        setLogoutModalOpen(false);
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
      </div>
    </nav>
  );
};

export default Navbar;
