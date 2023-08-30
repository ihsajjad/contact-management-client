import { useContext, useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import { IoNotifications } from "react-icons/io5";
import useAxiosSecure from "../hooks/useAxiosSecure";
const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [openNotifications, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { axiosSecure } = useAxiosSecure();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axiosSecure.get(`/all-notifications/${user?.email}`);
      setNotifications(res.data.notifications);
      const unRead = res.data?.notifications?.filter(
        (item) => item.read === false
      );
      setUnreadNotifications(unRead?.length);
    };

    fetchNotifications();
  }, [user]);

  console.log(unreadNotifications);

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
      <li>
        <NavLink
          to="/permitted-contacts"
          className={({ isActive }) =>
            ` ${
              isActive
                ? "text-[var(--main-color)] border-b-2 border-[var(--main-color)]"
                : ""
            }`
          }
        >
          Permitted Contacts
        </NavLink>
      </li>
    </>
  );

  const handleNotifications = () => {
    setOpenNotification(!openNotifications);

    if (unreadNotifications > 0) {
      axiosSecure.patch(`/update-notification-status/${user?.email}`);
      setUnreadNotifications(0);
    }
  };
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
      <div className="navbar-end relative">
        <p>{user?.email}</p>
        {user ? (
          <>
            <div className={`relative mr-8`}>
              <button onClick={handleNotifications} className="relative">
                <IoNotifications className="text-3xl " />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-4 font-bold text-[var(--main-color)]">
                    +{unreadNotifications}
                  </span>
                )}
              </button>
              {/* Notifications Modal */}
              <div
                className={` ${
                  openNotifications ? "absolute" : "hidden"
                }  p-4 rounded-lg top-12 -right-2/4 bg-slate-500 border-2 border-[var(--main-color)] shadow-lg shadow-black z-10 w-60`}
              >
                <h3 className="text-xl font-semibold border-b-4 border-[var(--main-color)] mb-2 text-center">
                  Notifications
                </h3>
                {notifications?.map((notification, i) => (
                  <div key={i} className="border-b pb-1">
                    <p>
                      {notification.message +
                        " from " +
                        notification.senderName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
