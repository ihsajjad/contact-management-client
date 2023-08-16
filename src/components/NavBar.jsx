import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);

  const items = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "text-[var(--main-color)] border-b-2 pb-1 px-1 border-[var(--main-color)]"
                : ""
            }`
          }
        >
          My Contact
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/s"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "text-[var(--main-color)] border-b-2 border-[var(--main-color)]"
                : ""
            }`
          }
        >
          Shared Contacts
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-slate-700 text-white md:px-10">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {items}
          </ul>
        </div>
        <a className="normal-case text-xl text-[var(--main-color)] font-bold">
          ContactManagement
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="space-x-4 menu-horizontal px-1 font-bold">{items}</ul>
      </div>
      <div className="navbar-end">
        <p>{user?.email}</p>
        {user ? (
          <>
            <button onClick={logOut} className="btn btn-sm">
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
