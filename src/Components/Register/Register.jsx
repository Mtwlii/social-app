import { useContext, useState } from "react";
import {
  FaUser,
  FaAt,
  FaEnvelope,
  FaLock,
  FaCalendar,
  FaSpinner,
  FaFacebook,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LeftSide from "./LeftSide";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be at most 20 characters"),
    email: zod
      .string()
      .email()
      .nonempty("Email is required")
      .regex(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Invalid email format",
      ),
    username: zod
      .string()
      .min(3, "At least 3 characters")
      .max(20)
      .optional()
      .or(zod.literal("")),
    gender: zod.enum(["male", "female"], "Gender is required"),
    dateOfBirth: zod.string().refine((value) => {
      const userDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - userDate.getFullYear();
      const monthDiff = today.getMonth() - userDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < userDate.getDate())
      ) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, "You must be at least 18 years old"),
    password: zod
      .string()
      .min(6)
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      )
      .nonempty("Password is required"),
    rePassword: zod.string().min(6).nonempty("Confirm password is required"),
  })
  .refine((object) => object.password === object.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const [apiError, setapiError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { setUserLogin, setUserDataEmail } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function handleRegister(values) {
    setisLoading(true);

    const { username, ...dataToSend } = values;
    if (username) dataToSend.username = username;

    axios
      .post("https://route-posts.routemisr.com/users/signup", dataToSend)
      .then((res) => {
        if (res.data.message === "account created") {
          localStorage.setItem("userToken", res.data.data.token);
          localStorage.setItem("UserDataEmail", res.data.data.user.email);
          // console.log("userData", res.data.data.user.email);
          
          setUserLogin(res.data.data.token);
          setUserDataEmail(res.data.data.user.email);
          navigate("/");
        }
      })
      .catch((err) => {
        setapiError(err?.response?.data?.message);
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  const inputClass = (hasError) =>
    `flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
      hasError
        ? "border-red-300 bg-red-50"
        : "border-gray-200 focus-within:border-blue-400"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:min-h-[calc(100vh-3rem)]">
        {/* Left Side */}
        <LeftSide />

        {/* Right Side - Form */}
        <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col justify-center h-full">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-5">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
              {apiError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-3"
          >
            {/* Name */}
            <div className="flex flex-col gap-1">
              <div className={inputClass(errors.name)}>
                <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Full name"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.name && (
                <span className="text-xs text-red-500 px-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <div className={inputClass(errors.username)}>
                <FaAt className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Username (optional)"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <div className={inputClass(errors.email)}>
                <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 px-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Gender + DOB row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <div className={inputClass(errors.gender)}>
                  <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                  <select
                    {...register("gender")}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                {errors.gender && (
                  <span className="text-xs text-red-500 px-1">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className={inputClass(errors.dateOfBirth)}>
                  <FaCalendar className="text-gray-400 text-sm flex-shrink-0" />
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  />
                </div>
                {errors.dateOfBirth && (
                  <span className="text-xs text-red-500 px-1">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className={inputClass(errors.password)}>
                <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 px-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <div className={inputClass(errors.rePassword)}>
                <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                <input
                  {...register("rePassword")}
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
              {errors.rePassword && (
                <span className="text-xs text-red-500 px-1">
                  {errors.rePassword.message}
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
                    ? "linear-gradient(135deg, #1565C0, #1976D2)"
                    : "#9CA3AF",
                color: "white",
              }}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign up →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
