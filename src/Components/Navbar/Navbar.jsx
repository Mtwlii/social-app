import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const navLinksLogin = [
  { key: "home", label: "Home" },
  { key: "profile", label: "Profile" },
];
const navLinksLogout = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];
const menuItems = [];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigation = useNavigate();
  const { userLogin, userDataEmail , setUserLogin, setUserDataEmail } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDataEmail");
    setUserLogin(null);
    setUserDataEmail(null);
    navigation("/login");
  }

  return (
    <>
      <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-6 h-16 flex items-center justify-between transition-colors duration-300 relative z-50">
        {/* Brand */}
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <Link to="/" className="font-bold text-inherit">
            SocialHub
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Nav Links - desktop only */}
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
            onClick={() => setDarkMode((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle dark mode"
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

          {/* Avatar Dropdown - logged in only */}
          {userLogin !== null && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full border-2 border-purple-500 overflow-hidden w-9 h-9 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
              >
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="Jason Hughes"
                  className="w-full h-full object-cover"
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 truncate">
                      {userDataEmail}
                    </p>
                  </div>
                  <div className="py-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.key}
                        to={`/${item.key}`}
                        className="w-full flex text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
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

          {/* Hamburger Button - mobile only, always visible */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle mobile menu"
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

      {/* Mobile Dropdown Menu */}
      <div
        className={`sm:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-end px-6 py-3 gap-4">
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
