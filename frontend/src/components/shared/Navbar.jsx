import { useState } from "react";
import { NavLink } from "react-router";
import {
  Home,
  Images,
  Info,
  LogIn,
  Mail,
  Menu,
  Package,
  Star,
  X,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, icon: Home },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/about", label: "About", icon: Info },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/contact", label: "Contact", icon: Mail },
];

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

  const closeMenu = () => setMenuOpen(false);

  const renderLinks = (className, onNavigate, iconSize = "h-4 w-4") =>
    NAV_LINKS.map(({ to, label, end, icon: Icon }) => (
      <li key={to}>
        <NavLink
          to={to}
          end={end}
          className={className}
          onClick={onNavigate}
        >
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
        <div className={`dropdown lg:hidden ${menuOpen ? "dropdown-open" : ""}`}>
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

        <NavLink
          to="/login"
          className="btn btn-primary btn-sm px-4 sm:px-5 font-semibold text-primary-content shadow-sm hover:shadow-md transition-shadow gap-1.5"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
