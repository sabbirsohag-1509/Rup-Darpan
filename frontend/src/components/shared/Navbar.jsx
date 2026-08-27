import { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
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
  X,
  ChevronDown,
  BookAlert,
} from "lucide-react";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import UserNotificationBell from "./UserNotificationBell";

// =====================================================
// NAVIGATION LINKS
// =====================================================

const getNavLinks = () => {
  return [
    {
      to: "/",
      label: "Home",
      end: true,
      icon: Home,
    },
    {
      to: "/gallery",
      label: "Gallery",
      icon: Images,
    },
    {
      to: "/packages",
      label: "Packages",
      icon: Package,
    },
    {
      to: "/about",
      label: "About",
      icon: Info,
    },
    {
      to: "/contact",
      label: "Contact",
      icon: Mail,
    },
  ];
};

// =====================================================
// DESKTOP NAV LINK
// =====================================================

const navLinkClass = ({ isActive }) =>
  [
    "relative flex items-center gap-1.5 px-3 py-2",
    "text-sm font-medium tracking-wide",
    "transition-colors duration-200",
    "hover:text-primary",

    isActive ? "font-semibold text-primary" : "text-base-content/70",

    "after:absolute after:bottom-0 after:left-3 after:right-3",
    "after:h-0.5 after:rounded-full after:bg-primary",
    "after:origin-left after:transition-transform",
    "after:duration-200",

    isActive
      ? "after:scale-x-100"
      : "after:scale-x-0 hover:after:scale-x-100",
  ].join(" ");

// =====================================================
// MOBILE NAV LINK
// =====================================================

const mobileLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5",
    "text-base font-medium transition-colors duration-200",

    isActive
      ? "bg-primary/10 font-semibold text-primary"
      : "text-base-content/80 hover:bg-base-200 hover:text-primary",
  ].join(" ");

// =====================================================
// PROFILE DROPDOWN
// =====================================================

const ProfileDropdown = ({ setProfileOpen, setLogoutModalOpen }) => {
  return (
    <div
      className="
        absolute
        right-0
        top-14
        z-[70]
        w-52
        rounded-xl
        border border-primary/15
        bg-base-100
        p-2
        shadow-xl
      "
    >
      {/* Dashboard */}

      <NavLink
        to="/dashboard"
        onClick={() => setProfileOpen(false)}
        className="
          flex items-center gap-3
          rounded-lg
          px-3 py-2.5
          text-sm font-medium
          text-base-content/80
          transition-colors
          hover:bg-primary/10
          hover:text-primary
        "
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </NavLink>

      {/* Divider */}

      <div className="my-1 border-t border-primary/10" />

      {/* Logout */}

      <button
        type="button"
        onClick={() => {
          setProfileOpen(false);
          setLogoutModalOpen(true);
        }}
        className="
          flex w-full
          items-center gap-3
          rounded-lg
          px-3 py-2.5
          text-sm font-medium
          text-base-content/80
          transition-colors
          hover:bg-primary/10
          hover:text-primary
        "
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
};

// =====================================================
// DESKTOP ABOUT DROPDOWN
// =====================================================

const AboutDropdown = ({ onClose }) => {
  const location = useLocation();

  const isPolicyActive = location.pathname === "/policy";

  return (
    <div
      className="
        absolute
        left-1/2
        top-full
        z-[70]
        mt-2
        w-52
        -translate-x-1/2
        rounded-xl
        border border-primary/15
        bg-base-100
        p-2
        shadow-xl
      "
    >
      <NavLink
        to="/policy"
        onClick={onClose}
        className={`
          flex items-center gap-2.5
          rounded-lg
          px-3 py-2.5
          text-sm font-medium
          transition-all duration-200

          ${
            isPolicyActive
              ? "bg-primary/10 font-semibold text-primary"
              : "text-base-content/80 hover:bg-primary/10 hover:text-primary"
          }
        `}
      >
        <BookAlert className="h-4 w-4 shrink-0" />

        <span>Our Policy</span>
      </NavLink>
    </div>
  );
};

// =====================================================
// NAVBAR
// =====================================================

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const { user, loading, logout } = useContext(AuthContext);

  const location = useLocation();

  const navLinks = getNavLinks();

  // ===================================================
  // POLICY PAGE CHECK
  // ===================================================

  const isPolicyPage = location.pathname === "/policy";

  // ===================================================
  // AUTO OPEN ABOUT ON POLICY PAGE - DESKTOP
  // ===================================================

  useEffect(() => {
    if (isPolicyPage && window.innerWidth >= 1024) {
      setAboutOpen(true);
    }
  }, [isPolicyPage]);

  // ===================================================
  // CLOSE MOBILE MENU
  // ===================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  // ===================================================
  // ABOUT TOGGLE
  // ===================================================

  const handleAboutClick = () => {
    setAboutOpen((prev) => !prev);
  };

  // ===================================================
  // RENDER DESKTOP LINKS
  // ===================================================

  const renderLinks = (
    className,
    onNavigate,
    iconSize = "h-4 w-4"
  ) => {
    return navLinks.map(({ to, label, end, icon: Icon }) => {
      // =================================================
      // ABOUT DROPDOWN
      // =================================================

      if (label === "About") {
        return (
          <li
            key={to}
            className="relative"
            onMouseEnter={() => {
              if (window.innerWidth >= 1024) {
                setAboutOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 1024) {
                setAboutOpen(false);
              }
            }}
          >
            <NavLink
              to="/about"
              className="
                relative
                flex
                items-center
                gap-1.5
                px-3
                py-2
                text-sm
                font-medium
                tracking-wide
                transition-colors
                duration-200
                hover:text-primary
              "
              aria-expanded={aboutOpen}
              aria-haspopup="true"
            >
              <Icon
                className={iconSize}
                aria-hidden="true"
              />

              <span>About</span>

              <ChevronDown
                className={`
                  h-4 w-4
                  transition-transform
                  duration-200
                  ${aboutOpen ? "rotate-180" : "rotate-0"}
                `}
                aria-hidden="true"
              />
            </NavLink>

            {aboutOpen && (
              <AboutDropdown
                onClose={() => setAboutOpen(false)}
              />
            )}
          </li>
        );
      }

      // =================================================
      // NORMAL DESKTOP LINK
      // =================================================

      return (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={className}
            onClick={onNavigate}
          >
            <Icon
              className={iconSize}
              aria-hidden="true"
            />

            {label}
          </NavLink>
        </li>
      );
    });
  };

  // ===================================================
  // ADMIN NOTIFICATION
  // ===================================================

  const AdminNotification = () => {
    if (loading || user?.role !== "admin") {
      return null;
    }

    return <NotificationBell />;
  };

  // ===================================================
  // USER NOTIFICATION
  // ===================================================

  const UserNotification = () => {
    if (loading || !user || user?.role === "admin") {
      return null;
    }

    return <UserNotificationBell />;
  };

  // ===================================================
  // PROFILE
  // ===================================================

  const ProfileSection = () => {
    if (loading) {
      return (
        <span className="loading loading-spinner loading-sm" />
      );
    }

    if (!user) {
      return (
        <NavLink
          to="/login"
          className="
            btn
            btn-primary
            btn-sm
            gap-1.5
            px-4
            font-semibold
            text-primary-content
          "
        >
          <LogIn className="h-4 w-4" />
          Login
        </NavLink>
      );
    }

    return (
      <div className="relative">
        <button
          type="button"
          className="avatar cursor-pointer"
          onClick={() => {
            setProfileOpen((prev) => !prev);
            setMenuOpen(false);
          }}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
        >
          <div
            className="
              h-10
              w-10
              overflow-hidden
              rounded-full
              ring-2
              ring-primary/30
              ring-offset-2
              ring-offset-base-100
            "
          >
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name || "User profile"}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-primary
                  font-semibold
                  text-primary-content
                "
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </button>

        {profileOpen && (
          <ProfileDropdown
            setProfileOpen={setProfileOpen}
            setLogoutModalOpen={setLogoutModalOpen}
          />
        )}
      </div>
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      {/* =================================================
          NAVBAR WRAPPER
      ================================================= */}

      <div className="z-[80] w-full">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <nav
          className="
            mx-auto
            w-full
            max-w-7xl
          "
          aria-label="Main navigation"
        >
          {/* =================================================
              MOBILE NAVBAR
          ================================================= */}

          <div className="lg:hidden">
            <div
              className="
                flex
                min-h-[4.25rem]
                w-full
                items-center
                justify-between
                px-4
              "
            >
              {/* MOBILE LEFT */}

              <div className="flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    className="
                      btn
                      btn-ghost
                      btn-square
                    "
                    aria-label={
                      menuOpen
                        ? "Close menu"
                        : "Open menu"
                    }
                    aria-expanded={menuOpen}
                    onClick={() => {
                      setMenuOpen((open) => !open);
                      setProfileOpen(false);
                    }}
                  >
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>

                  {/* MOBILE MENU */}

                  {menuOpen && (
                    <ul
                      className="
                        absolute
                        left-0
                        top-full
                        z-[60]
                        mt-3
                        w-60
                        rounded-xl
                        border border-primary/10
                        bg-base-100
                        p-2
                        shadow-xl
                      "
                    >
                      {navLinks.map(
                        ({
                          to,
                          label,
                          end,
                          icon: Icon,
                        }) => {
                          if (label === "About") {
                            return (
                              <li key={to}>
                                <div
                                  className={`
                                    flex
                                    w-full
                                    items-center
                                    rounded-lg
                                    transition-colors
                                    duration-200

                                    ${
                                      isPolicyPage ||
                                      location.pathname ===
                                        "/about"
                                        ? "bg-primary/10 text-primary"
                                        : "text-base-content/80"
                                    }
                                  `}
                                >
                                  <NavLink
                                    to="/about"
                                    onClick={() => {
                                      setMenuOpen(false);
                                      setAboutOpen(false);
                                    }}
                                    className="
                                      flex
                                      flex-1
                                      items-center
                                      gap-2.5
                                      px-3
                                      py-2.5
                                      text-base
                                      font-medium
                                    "
                                  >
                                    <Icon className="h-4 w-4" />

                                    <span>About</span>
                                  </NavLink>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAboutOpen(
                                        (prev) => !prev
                                      )
                                    }
                                    className="
                                      flex
                                      items-center
                                      justify-center
                                      px-3
                                      py-2.5
                                      text-base-content/70
                                      hover:text-primary
                                    "
                                    aria-label="Toggle About submenu"
                                  >
                                    <ChevronDown
                                      className={`
                                        h-4
                                        w-4
                                        transition-transform
                                        duration-200

                                        ${
                                          aboutOpen
                                            ? "rotate-180"
                                            : "rotate-0"
                                        }
                                      `}
                                    />
                                  </button>
                                </div>

                                {aboutOpen && (
                                  <div
                                    className="
                                      mt-1
                                      ml-4
                                      border-l
                                      border-primary/20
                                      pl-2
                                    "
                                  >
                                    <NavLink
                                      to="/policy"
                                      onClick={() => {
                                        setMenuOpen(false);
                                        setAboutOpen(false);
                                      }}
                                      className={({
                                        isActive,
                                      }) =>
                                        `
                                          flex
                                          w-full
                                          items-center
                                          gap-2.5
                                          rounded-lg
                                          px-3
                                          py-2.5
                                          text-sm
                                          font-medium

                                          ${
                                            isActive
                                              ? "bg-primary/10 font-semibold text-primary"
                                              : "text-base-content/70 hover:bg-primary/10 hover:text-primary"
                                          }
                                        `
                                      }
                                    >
                                      <BookAlert className="h-4 w-4" />

                                      <span>
                                        Our Policy
                                      </span>
                                    </NavLink>
                                  </div>
                                )}
                              </li>
                            );
                          }

                          return (
                            <li key={to}>
                              <NavLink
                                to={to}
                                end={end}
                                className={
                                  mobileLinkClass
                                }
                                onClick={closeMenu}
                              >
                                <Icon className="h-4 w-4" />
                                {label}
                              </NavLink>
                            </li>
                          );
                        }
                      )}

                      {/* MOBILE LOGIN */}

                      {!loading && !user && (
                        <li className="mt-1 border-t border-primary/10 pt-2">
                          <NavLink
                            to="/login"
                            className="
                              btn
                              btn-primary
                              btn-sm
                              w-full
                              gap-2
                              text-primary-content
                            "
                            onClick={closeMenu}
                          >
                            <LogIn className="h-4 w-4" />
                            Login
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* MOBILE LOGO */}

              <NavLink
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  setAboutOpen(false);
                }}
                className="
                  flex
                  items-center
                  transition-opacity
                  duration-200
                  hover:opacity-90
                "
              >
                <Logo compact />
              </NavLink>

              {/* MOBILE RIGHT */}

              <div className="flex items-center gap-2">
                {/* Admin Notification */}

                <AdminNotification />

                {/* User Notification */}

                <UserNotification />

                <ThemeToggle />

                <ProfileSection />
              </div>
            </div>
          </div>

          {/* =================================================
              DESKTOP NAVBAR
          ================================================= */}

          <div className="hidden lg:block">
            <div
              className="
                flex
                min-h-[4.25rem]
                w-full
                items-center
                justify-between
                px-4
                sm:px-5
              "
            >
              {/* =================================================
                  LOGO
              ================================================= */}

              <div className="flex shrink-0 items-center">
                <NavLink
                  to="/"
                  className="
                    flex
                    items-center
                    transition-opacity
                    duration-200
                    hover:opacity-90
                  "
                >
                  <Logo compact />
                </NavLink>
              </div>

              {/* =================================================
                  NAVIGATION
              ================================================= */}

              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                "
              >
                <ul
                  className="
                    menu
                    menu-horizontal
                    shrink-0
                    gap-0
                    px-0
                  "
                >
                  {renderLinks(navLinkClass)}
                </ul>
              </div>

              {/* =================================================
                  RIGHT CONTROLS
              ================================================= */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-end
                  gap-3
                "
              >
                {/* ADMIN NOTIFICATION */}

                <AdminNotification />

                {/* USER NOTIFICATION */}

                <UserNotification />

                {/* THEME */}

                <ThemeToggle />

                {/* PROFILE */}

                <ProfileSection />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* =================================================
          LOGOUT MODAL
      ================================================= */}

      {logoutModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            h-screen
            w-full
            items-center
            justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="
              w-full
              max-w-sm
              rounded-2xl
              border
              border-primary/30
              bg-base-100/90
              p-6
              shadow-2xl
              backdrop-blur-xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* ICON */}

            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-primary
                ring-1
                ring-primary/30
              "
            >
              <LogOut className="h-6 w-6" />
            </div>

            {/* CONTENT */}

            <div className="text-center">
              <h3 className="font-playfair text-2xl font-semibold">
                Logout?
              </h3>

              <p className="mt-2 text-sm text-base-content/65">
                Are you sure you want to log out of your account?
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">
              {/* CANCEL */}

              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="
                  btn
                  btn-ghost
                  flex-1
                  border
                  border-base-content/10
                "
              >
                Cancel
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={() => {
                  logout()
                    .then(() => {
                      setLogoutModalOpen(false);

                      toast.success(
                        "Logged out successfully!"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Logout error:",
                        error
                      );

                      toast.error(
                        "Failed to log out. Please try again."
                      );
                    });
                }}
                className="
                  btn
                  btn-primary
                  flex-1
                  text-primary-content
                "
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

export default Navbar;