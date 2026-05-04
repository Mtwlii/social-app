import { useRef, useState } from "react";
import axios from "axios";
import { FaImage, FaSpinner, FaTimes } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
export default function CreatePost() {
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { body: "", image: null },
  });

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };
  const fileInputRef = useRef(null); //select any jsx element and give it a reference  ==> fileInputRef.current

  const bodyValue = watch("body");


  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/profile-data", {
          headers,
        })
        .then((res) => res.data.data.user),
  });
  function onSubmit(data) {
    const formData = new FormData();
    formData.append("body", data.body);
    if (data.image?.[0]) formData.append("image", data.image[0]);
    createPost(formData);
  }

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: (formData) =>
      axios.post("https://route-posts.routemisr.com/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      reset();
      setImagePreview(null);
      fileInputRef.current.value = "";
    },
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-medium text-sm flex-shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="flex-1 flex flex-col gap-3">
            {/* Input */}
            <textarea
              placeholder="What's on your mind?"
              rows={3}
              className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none resize-none"
              {...register("body", { required: true, minLength: 2 })}
            />
            {errors.body && (
              <p className="text-xs text-red-500">
                Post must be at least 2 characters.
              </p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full">
                <img
                  src={imagePreview}
                  className="w-full max-h-60 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              {/* Image Upload */}
              <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-400 hover:text-purple-500 transition-colors">
                <FaImage />
                <span>Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setValue("image", e.target.files);
                    const file = e.target.files[0];
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!bodyValue?.trim() || isPending}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                {isPending ? <FaSpinner className="animate-spin" /> : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
