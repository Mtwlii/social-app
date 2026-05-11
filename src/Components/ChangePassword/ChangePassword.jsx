import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const schema = zod
  .object({
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain uppercase, lowercase, number, and special character",
      ),
    newPassword: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain uppercase, lowercase, number, and special character",
      ),
    confirmPassword: zod.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.password, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function PasswordField({ label, name, register, errors, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
          errors[name]
            ? "border-red-300 bg-red-50 dark:bg-red-900/20"
            : "border-gray-200 dark:border-zinc-700 focus-within:border-purple-400 dark:bg-zinc-800"
        }`}
      >
        <FaLock className="text-gray-400 text-sm flex-shrink-0" />
        <input
          {...register(name)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors[name] && (
        <span className="text-xs text-red-500 px-1">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data) =>
      axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        { password: data.password, newPassword: data.newPassword },
        { headers: { ...headers, "Content-Type": "application/json" } },
      ),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      reset();
      setTimeout(() => navigate(-1), 1500);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      // لو الباسورد القديم غلط
      if (
        msg.toLowerCase().includes("password") ||
        err.response?.status === 401
      ) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(msg);
      }
    },
  });

  function onSubmit(data) {
    changePassword(data);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-sm p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-zinc-400"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Choose a strong new password
            </p>
          </div>
        </div>

        {/* Rules hint */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl px-4 py-3 flex flex-col gap-1">
          <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
            Password must include:
          </p>
          {[
            "At least 8 characters",
            "Uppercase & lowercase letters",
            "At least one number",
            "At least one special character (#?!@$%^&*-)",
          ].map((rule) => (
            <div
              key={rule}
              className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400"
            >
              <FaCheckCircle className="flex-shrink-0" />
              {rule}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <PasswordField
            label="Current Password"
            name="password"
            register={register}
            errors={errors}
            placeholder="Enter your current password"
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            register={register}
            errors={errors}
            placeholder="Enter your new password"
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            register={register}
            errors={errors}
            placeholder="Confirm your new password"
          />

          <button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                isValid && !isPending
                  ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
                  : "#9CA3AF",
              color: "white",
            }}
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save New Password →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
