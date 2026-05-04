import { useContext, useState } from "react";
import { FaEnvelope, FaLock, FaSpinner, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LeftSide from "../Register/LeftSide";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const schema = zod.object({
  emailOrUsername: zod
    .string()
    .min(1, "Email or username is required")
    .refine(
      (value) => {
        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return emailRegex.test(value) || usernameRegex.test(value);
      },
      { message: "Please enter a valid email or username" },
    ),
  password: zod
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
});

export default function Login() {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUserDataEmail, setUserLogin } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function handleLogin(values) {
    setIsLoading(true);
    setApiError(null);

    const loginData = {
      email: values.emailOrUsername,
      password: values.password,
    };

    axios
      .post("https://route-posts.routemisr.com/users/signin", loginData)
      .then((res) => {
        localStorage.setItem("userToken", res.data.data.token);
        localStorage.setItem("userDataEmail", res.data.data.user.email);
        localStorage.setItem("userId", res.data.data.user._id);
        setUserLogin(res.data.data.token);
        setUserDataEmail(res.data.data.user.email);

        navigate("/home");
      })
      .catch((err) => {
        setApiError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:min-h-[calc(100vh-3rem)]">
        {/* Left Side */}
        <LeftSide />

        {/* Right Side - Form */}
        <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col justify-center h-full">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Login
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </NavLink>
          </p>

          {/* Social Buttons */}
          <div className="flex gap-3 mb-5">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FcGoogle className="text-lg" />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 rounded-xl py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <FaFacebook className="text-lg" />
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {apiError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
                  errors.emailOrUsername
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus-within:border-blue-400"
                }`}
              >
                <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("emailOrUsername")}
                  type="text"
                  placeholder="name@example.com"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.emailOrUsername && (
                <span className="text-xs text-red-500 px-1">
                  {errors.emailOrUsername.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus-within:border-blue-400"
                }`}
              >
                <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="current-password"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 px-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  isValid && !isLoading
                    ? "linear-gradient(135deg, #546E7A, #37474F)"
                    : "#9CA3AF",
                color: "white",
              }}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in →"
              )}
            </button>

            <p className="text-center text-sm text-blue-600 hover:underline cursor-pointer mt-1">
              Forgot password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
