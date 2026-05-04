import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useDarkMode } from "../../Context/DarkModeContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaCamera, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

const navLinksLogin = [
  { key: "home", label: "Home" },
  { key: "profile", label: "Profile" },
];
const navLinksLogout = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const { userLogin, userDataEmail, setUserLogin, setUserDataEmail } =
    useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  // ============ جيب بيانات المستخدم ============
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/profile-data", {
          headers,
        })
        .then((res) => res.data.data.user),
    enabled: !!userLogin,
  });

  // ============ رفع صورة ============
  const { mutate: uploadPhoto, isPending: isUploading } = useMutation({
    mutationFn: (formData) =>
      axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  // ============ تغيير الباسورد ============
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: changePassword, isPending: isChanging } = useMutation({
    mutationFn: (data) =>
      axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        data,
        { headers: { ...headers, "Content-Type": "application/json" } },
      ),
    onSuccess: () => {
      reset();
      setShowPasswordForm(false);
    },
  });

  function onPasswordSubmit(data) {
    changePassword({ password: data.password, newPassword: data.newPassword });
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowPasswordForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDataEmail");
    localStorage.removeItem("userId");
    setUserLogin(null);
    setUserDataEmail(null);
    navigation("/login");
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-6 h-16 flex items-center justify-between transition-colors duration-300 z-50">
        {/* Brand */}
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <Link to="/" className="font-bold text-inherit">
            SocialHub
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-7">
            {(userLogin !== null ? navLinksLogin : navLinksLogout).map(
              (link) => {
                const path = link.key === "home" ? "/" : `/${link.key}`;
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={link.key}
                    to={path}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              },
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Avatar Dropdown */}
          {userLogin !== null && (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full border-2 border-purple-500 overflow-hidden w-9 h-9 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-medium text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User Info + صورة */}
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-3">
                      {/* Avatar مع زرار رفع صورة */}
                      <div className="relative flex-shrink-0">
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-medium">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current.click()}
                          disabled={isUploading}
                          className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow transition-colors"
                        >
                          {isUploading ? (
                            <FaSpinner
                              className="animate-spin text-xs"
                              style={{ fontSize: "8px" }}
                            />
                          ) : (
                            <FaCamera style={{ fontSize: "8px" }} />
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append("photo", file);
                              uploadPhoto(formData);
                            }
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                          {userDataEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Change Password Toggle */}
                  <div className="py-1">
                    <button
                      onClick={() => setShowPasswordForm((prev) => !prev)}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      🔒 Change Password
                    </button>
                  </div>

                  {/* Password Form */}
                  {showPasswordForm && (
                    <form
                      onSubmit={handleSubmit(onPasswordSubmit)}
                      className="px-4 pb-3 flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-700"
                    >
                      {/* Current Password */}
                      <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2 mt-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Current password"
                          className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400"
                          {...register("password", {
                            required: true,
                            minLength: 8,
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="text-gray-400 text-xs"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500">
                          Min 8 characters.
                        </p>
                      )}

                      {/* New Password */}
                      <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New password"
                          className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400"
                          {...register("newPassword", {
                            required: true,
                            minLength: 8,
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((p) => !p)}
                          className="text-gray-400 text-xs"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-xs text-red-500">
                          Min 8 characters.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isChanging}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {isChanging ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Save Password"
                        )}
                      </button>
                    </form>
                  )}

                  {/* Logout */}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span
              className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col items-end px-6 pt-20 pb-5 gap-4">
          {(userLogin !== null ? navLinksLogin : navLinksLogout).map((link) => {
            const path = link.key === "home" ? "/" : `/${link.key}`;
            const isActive = location.pathname === path;
            return (
              <Link
                key={link.key}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
