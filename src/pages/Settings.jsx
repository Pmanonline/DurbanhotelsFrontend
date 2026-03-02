import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/Theme/themeSlice";
import { FaSun, FaMoon, FaBell, FaLock, FaUser, FaGlobe } from "react-icons/fa";

const Settings = () => {
  const { mode } = useSelector((state) => state.theme);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("appearance");

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const tabs = [
    {
      id: "appearance",
      name: "Appearance",
      icon: <FaSun className="w-5 h-5" />,
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: <FaBell className="w-5 h-5" />,
    },
    { id: "account", name: "Account", icon: <FaUser className="w-5 h-5" /> },
  ];

  return (
    <div className=" mt-12 min-h-screen bg-gray-50 dark:bg-primary-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-primary-800 rounded-lg shadow-md p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-700"
                  }`}>
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-md p-6">
              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Appearance
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Customize how the application looks for you
                    </p>
                  </div>

                  {/* Theme Selection */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Theme Mode
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Light Mode */}
                      <button
                        onClick={() => mode === "dark" && handleThemeToggle()}
                        className={`relative flex items-center gap-4 p-5 rounded-lg border-2 transition-all ${
                          mode === "light"
                            ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <FaSun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            Light Mode
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Bright and clear interface
                          </div>
                        </div>
                        {mode === "light" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-secondary-500 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>

                      {/* Dark Mode */}
                      <button
                        onClick={() => mode === "light" && handleThemeToggle()}
                        className={`relative flex items-center gap-4 p-5 rounded-lg border-2 transition-all ${
                          mode === "dark"
                            ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <FaMoon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            Dark Mode
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Easy on the eyes in low light
                          </div>
                        </div>
                        {mode === "dark" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-secondary-500 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Notifications
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Manage how you receive notifications
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Email Notifications",
                        description: "Receive updates via email",
                      },
                      {
                        label: "Push Notifications",
                        description: "Get notified in your browser",
                      },
                      {
                        label: "Event Reminders",
                        description: "Reminders for upcoming events",
                      },
                      {
                        label: "Blog Updates",
                        description: "Get notified about new blog posts",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 dark:peer-focus:ring-secondary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Account Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Manage your account information
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userInfo?.email || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-primary-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={userInfo?.username || userInfo?.name || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-primary-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
