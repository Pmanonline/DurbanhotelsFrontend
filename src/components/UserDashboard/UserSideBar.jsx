import React, { useState, useEffect, useRef } from "react";
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { IoPerson } from "react-icons/io5";
import {
  FaUserCircle,
  FaHome,
  FaHeart,
  FaHistory,
  FaShoppingCart,
  FaRegBell,
  FaRegBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { MdPayments, MdLocationOn, MdSupportAgent } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/Auth/authSlice";

const UserSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const profile = userInfo?.name || {};
  const UserName = userInfo?.name || "Anonymous";

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSmallScreen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSmallScreen]);

  const sidebarLinks = [
    { path: "/user/MyDashBoad", icon: FaHome, label: "My Dashboard" },
    { path: "/user/profile", icon: IoPerson, label: "My Profile" },
    {
      path: "/user/Allbusiness",
      icon: FaRegBuilding,
      label: "Registered Businesses",
    },
    { path: "/user/finance", icon: MdPayments, label: "Finance" },
    {
      path: "/user/VerifyDocuments",
      icon: FaCheckCircle,
      label: "Verify Documents",
    },
    { path: "/user/support", icon: MdSupportAgent, label: "Support" },
    {
      path: "/user/notifications",
      icon: FaRegBell,
      label: "Notifications",
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between ${
          isSmallScreen ? "" : "hidden"
        }`}>
        <div className="flex items-center">
          <span className="mb-2">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <FaUserCircle className="w-7 h-7 text-[#005a7e] mr-4 cursor-pointer" />
            )}
          </span>
          <span className="mb-1 mr-2 font-medium text-xs">
            {UserName || "User"}
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-[#0A0B2E] hover:text-[#005a7e] p-2 rounded-md focus:outline-none transition-colors duration-200">
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 ${
          isCollapsed ? "w-24" : "w-48 lg:w-64"
        } bg-gradient-to-b from-[#0A0B2E] to-[#005a7e] text-white transition-all duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isSmallScreen ? "top-16" : "top-0"}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-5">
            <Link to={"/"}>
              <h1 className="text-2xl font-bold mb-1">E-Direct</h1>
            </Link>
            {!isCollapsed && (
              <p className="text-sm text-blue-200 mb-6">My Dashboard</p>
            )}
            {!isSmallScreen && (
              <div className="flex items-center">
                <span className="mb-2">
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-7 h-7 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  ) : (
                    <FaUserCircle className="w-7 h-7 text-gray-300 mr-4 cursor-pointer" />
                  )}
                </span>
                {!isCollapsed && (
                  <span className="mb-1 mr-2 font-extralight text-xs">
                    {UserName || "User"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-grow overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => isSmallScreen && setIsOpen(false)}
                className={`flex items-center px-5 py-3 text-sm transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#003a5e] text-white"
                    : "hover:bg-[#004a6e]"
                }`}>
                <link.icon className="w-5 h-5 mr-3" />
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Collapse Button */}
          {!isSmallScreen && (
            <button
              onClick={toggleCollapse}
              className="p-3 text-sm text-white hover:bg-[#004a6e] transition-colors duration-200">
              {isCollapsed ? <HiMenu size={24} /> : <HiX size={24} />}
            </button>
          )}

          {/* Logout Button */}
          <div className="p-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm bg-[#003a5e] hover:bg-red-500 text-white rounded-md transition-colors duration-200">
              <HiOutlineLogout className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for Desktop */}
      <div
        className={`transition-all duration-300 ${
          isOpen && !isSmallScreen ? (isCollapsed ? "ml-20" : "ml-64") : "ml-0"
        }`}></div>
    </>
  );
};

export default UserSidebar;
