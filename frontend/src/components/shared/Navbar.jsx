import { useState, useContext, useEffect } from "react";
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
  X,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

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

    isActive
      ? "font-semibold text-primary"
      : "text-base-content/70",

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

const ProfileDropdown = ({
  setProfileOpen,
  setLogoutModalOpen,
}) => {
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
// NAVBAR
// =====================================================

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [logoutModalOpen, setLogoutModalOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const { user, loading, logout } =
    useContext(AuthContext);

  const navLinks = getNavLinks();

  // ===================================================
  // SCROLL DETECTION
  // ===================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    // Initial check

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  // ===================================================
  // CLOSE MOBILE MENU
  // ===================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ===================================================
  // RENDER NAV LINKS
  // ===================================================

  const renderLinks = (
    className,
    onNavigate,
    iconSize = "h-4 w-4",
  ) => {
    return navLinks.map(
      ({ to, label, end, icon: Icon }) => (
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
      ),
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      {/* =================================================
          NAVBAR OUTER WRAPPER
      ================================================= */}

      <div
        className={`
          z-[80]
          w-full
          transition-all
          duration-300
          ease-in-out

          ${
            isScrolled
              ? "fixed inset-x-0 top-0 px-0 pt-2"
              : "relative"
          }
        `}
      >
        {/* =================================================
            NAVBAR
        ================================================= */}

        <nav
          className={`
            mx-auto
            w-full
            max-w-7xl

            transition-all
            duration-300
            ease-in-out

            ${
              isScrolled
                ? `
                  rounded-2xl
                  border border-primary/10
                  bg-base-100/90
                  shadow-lg
                  backdrop-blur-xl
                `
                : "bg-transparent"
            }
          `}
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
              {/* =================================================
                  MOBILE LEFT — MENU
              ================================================= */}

              <div className="flex items-center">
                <div
                  className={`dropdown ${
                    menuOpen
                      ? "dropdown-open"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    tabIndex={0}
                    className="btn btn-ghost btn-square"
                    aria-label={
                      menuOpen
                        ? "Close menu"
                        : "Open menu"
                    }
                    aria-expanded={menuOpen}
                    onClick={() =>
                      setMenuOpen(
                        (open) => !open,
                      )
                    }
                  >
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>

                  {/* =================================================
                      MOBILE MENU
                  ================================================= */}

                  <ul
                    tabIndex={0}
                    className="
                      menu menu-sm
                      dropdown-content
                      z-[60]
                      mt-3
                      w-56
                      rounded-box
                      border border-primary/10
                      bg-base-100
                      p-2
                      shadow-lg
                    "
                  >
                    {renderLinks(
                      mobileLinkClass,
                      closeMenu,
                      "h-4 w-4",
                    )}

                    {!loading && !user && (
                      <li className="mt-1 border-t border-primary/10 pt-2">
                        <NavLink
                          to="/login"
                          className="
                            btn btn-primary btn-sm
                            w-full gap-2
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
                </div>
              </div>

              {/* =================================================
                  MOBILE LOGO
              ================================================= */}

              <NavLink
                to="/"
                className="
                  flex items-center
                  transition-opacity
                  duration-200
                  hover:opacity-90
                "
              >
                <Logo compact />
              </NavLink>

              {/* =================================================
                  MOBILE RIGHT
              ================================================= */}

              <div className="flex items-center gap-2">
                <ThemeToggle />

                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : user ? (
                  <div className="relative">
                    {/* Profile */}

                    <button
                      type="button"
                      className="avatar cursor-pointer"
                      onClick={() =>
                        setProfileOpen(
                          (prev) => !prev,
                        )
                      }
                      aria-label="Open profile menu"
                      aria-expanded={
                        profileOpen
                      }
                    >
                      <div
                        className="
                          h-10 w-10
                          overflow-hidden
                          rounded-full
                          ring-2 ring-primary/30
                          ring-offset-2
                          ring-offset-base-100
                        "
                      >
                        {user.profilePhoto ? (
                          <img
                            src={
                              user.profilePhoto
                            }
                            alt={
                              user.name ||
                              "User profile"
                            }
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
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "U"}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Profile Dropdown */}

                    {profileOpen && (
                      <ProfileDropdown
                        setProfileOpen={
                          setProfileOpen
                        }
                        setLogoutModalOpen={
                          setLogoutModalOpen
                        }
                      />
                    )}
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    className="
                      btn btn-primary btn-sm
                      px-3
                      font-semibold
                      text-primary-content
                    "
                  >
                    <LogIn className="h-4 w-4" />
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              DESKTOP NAVBAR
          ================================================= */}

          <div className="hidden lg:block">
            {/* =================================================
                NORMAL DESKTOP STATE
            ================================================= */}

            {!isScrolled ? (
              <div className="px-6">
                {/* =================================================
                    TOP AREA
                ================================================= */}

                <div
                  className="
                    relative
                    flex
                    min-h-[4.5rem]
                    items-center
                    justify-between
                  "
                >
                  {/* Left Spacer */}

                  <div className="w-1/3" />

                  {/* =================================================
                      CENTER LOGO
                  ================================================= */}

                  <NavLink
                    to="/"
                    className="
                      absolute
                      left-1/2
                      flex
                      -translate-x-1/2
                      items-center
                      transition-opacity
                      duration-200
                      hover:opacity-90
                    "
                  >
                    <Logo compact />
                  </NavLink>

                  {/* =================================================
                      RIGHT CONTROLS
                  ================================================= */}

                  <div
                    className="
                      flex
                      w-1/3
                      items-center
                      justify-end
                      gap-3
                    "
                  >
                    <ThemeToggle />

                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : user ? (
                      <div className="relative">
                        <button
                          type="button"
                          className="avatar cursor-pointer"
                          onClick={() =>
                            setProfileOpen(
                              (prev) =>
                                !prev,
                            )
                          }
                          aria-label="Open profile menu"
                          aria-expanded={
                            profileOpen
                          }
                        >
                          <div
                            className="
                              h-10 w-10
                              overflow-hidden
                              rounded-full
                              ring-2 ring-primary/30
                              ring-offset-2
                              ring-offset-base-100
                            "
                          >
                            {user.profilePhoto ? (
                              <img
                                src={
                                  user.profilePhoto
                                }
                                alt={
                                  user.name ||
                                  "User profile"
                                }
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
                                {user.name
                                  ?.charAt(
                                    0,
                                  )
                                  .toUpperCase() ||
                                  "U"}
                              </div>
                            )}
                          </div>
                        </button>

                        {profileOpen && (
                          <ProfileDropdown
                            setProfileOpen={
                              setProfileOpen
                            }
                            setLogoutModalOpen={
                              setLogoutModalOpen
                            }
                          />
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to="/login"
                        className="
                          btn btn-primary btn-sm
                          gap-1.5
                          px-4
                          font-semibold
                          text-primary-content
                        "
                      >
                        <LogIn className="h-4 w-4" />

                        Login
                      </NavLink>
                    )}
                  </div>
                </div>

                {/* =================================================
                    NORMAL DESKTOP NAVIGATION
                ================================================= */}

                <div
                  className="
                    flex
                    justify-center
                    border-t
                    border-base-200/50
                    pt-2
                    pb-1
                  "
                >
                  <ul className="menu menu-horizontal gap-1 px-1">
                    {renderLinks(navLinkClass)}
                  </ul>
                </div>
              </div>
            ) : (
              /* =================================================
                 SCROLLED DESKTOP STATE

                 Logo  → LEFT
                 Nav   → CENTER
                 Auth  → RIGHT
              ================================================= */

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
                    LOGO — EXTREME LEFT
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
                    NAVIGATION — CENTER
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
                    RIGHT CONTROLS — EXTREME RIGHT
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
                  {/* Theme Toggle */}

                  <ThemeToggle />

                  {/* Authentication */}

                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : user ? (
                    <div className="relative">
                      <button
                        type="button"
                        className="avatar cursor-pointer"
                        onClick={() =>
                          setProfileOpen(
                            (prev) => !prev,
                          )
                        }
                        aria-label="Open profile menu"
                        aria-expanded={
                          profileOpen
                        }
                      >
                        <div
                          className="
                            h-10 w-10
                            overflow-hidden
                            rounded-full
                            ring-2 ring-primary/30
                            ring-offset-2
                            ring-offset-base-100
                          "
                        >
                          {user.profilePhoto ? (
                            <img
                              src={
                                user.profilePhoto
                              }
                              alt={
                                user.name ||
                                "User profile"
                              }
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
                              {user.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "U"}
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Profile Dropdown */}

                      {profileOpen && (
                        <ProfileDropdown
                          setProfileOpen={
                            setProfileOpen
                          }
                          setLogoutModalOpen={
                            setLogoutModalOpen
                          }
                        />
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to="/login"
                      className="
                        btn btn-primary btn-sm
                        gap-1.5
                        px-4
                        font-semibold
                        text-primary-content
                      "
                    >
                      <LogIn className="h-4 w-4" />

                      Login
                    </NavLink>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* =================================================
          DESKTOP FIXED NAVBAR SPACER

          Prevent content jump after navbar becomes fixed.
      ================================================= */}

      {isScrolled && (
        <div className="hidden h-[5rem] lg:block" />
      )}

      {/* =================================================
          LOGOUT MODAL
      ================================================= */}

      {logoutModalOpen && (
        <div
          className="
            fixed inset-0 z-[100]
            flex h-screen w-full
            items-center justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
          onClick={() =>
            setLogoutModalOpen(false)
          }
        >
          <div
            className="
              w-full max-w-sm
              rounded-2xl
              border border-primary/30
              bg-base-100/90
              p-6
              shadow-2xl
              backdrop-blur-xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* =================================================
                ICON
            ================================================= */}

            <div
              className="
                mx-auto mb-4
                flex h-14 w-14
                items-center justify-center
                rounded-full
                bg-primary/10
                text-primary
                ring-1 ring-primary/30
              "
            >
              <LogOut className="h-6 w-6" />
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="text-center">
              <h3 className="font-playfair text-2xl font-semibold">
                Logout?
              </h3>

              <p className="mt-2 text-sm text-base-content/65">
                Are you sure you want to log
                out of your account?
              </p>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-6 flex gap-3">
              {/* Cancel */}

              <button
                type="button"
                onClick={() =>
                  setLogoutModalOpen(false)
                }
                className="
                  btn btn-ghost
                  flex-1
                  border border-base-content/10
                "
              >
                Cancel
              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={() => {
                  logout()
                    .then(() => {
                      setLogoutModalOpen(false);

                      toast.success(
                        "Logged out successfully!",
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Logout error:",
                        error,
                      );

                      toast.error(
                        "Failed to log out. Please try again.",
                      );
                    });
                }}
                className="
                  btn btn-primary
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