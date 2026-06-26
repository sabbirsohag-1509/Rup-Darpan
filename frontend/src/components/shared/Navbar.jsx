import { NavLink } from "react-router";
import Logo from "./Logo";

const Navbar = () => {
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          Gallery
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/packages"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          Packages
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          About
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          Reviews
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : ""
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-10">
      {/* Mobile */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>

        <NavLink to="/">
          <Logo />
        </NavLink>
      </div>

      {/* Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1">{navLinks}</ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end">
        <NavLink to="/login" className="btn btn-primary">
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
