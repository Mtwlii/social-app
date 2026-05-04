import { useState } from "react";
import axios from "axios";
import { FaSpinner, FaImage } from "react-icons/fa";
import CommentItem from "./CommentItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function CommentsSection({ postId, comments, postUserName }) {
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { content: "", image: null },
  });

  const contentValue = watch("content");

  const { mutate: addComment, isPending: isCommenting } = useMutation({
    mutationFn: (formData) =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      reset();
      setImagePreview(null);
    },
  });

  const { data: user } = useQuery({
    queryKey: ["profile"], 
    queryFn: () =>
      axios.get("...profile-data").then((res) => res.data.data.user),
  });
  

  function onSubmit(data) {
    const formData = new FormData();
    formData.append("content", data.content);
    if (data.image?.[0]) formData.append("image", data.image[0]);
    addComment(formData);
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xs font-medium flex-shrink-0">
              {user?.photo ? (
                <img
                  src={user.photo}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-100 ...">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
                  {...register("content", { minLength: 2 })}
                />
                <label className="cursor-pointer text-gray-400 hover:text-purple-500 transition-colors">
                  <FaImage />
                  <input
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
                <button
                  type="submit"
                  disabled={contentValue?.trim().length < 2 || isCommenting}
                  className="text-xs font-medium text-purple-600 dark:text-purple-400 disabled:opacity-40"
                >
                  {isCommenting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Comment"
                  )}
                </button>
              </div>

              {imagePreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image", null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-2">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
 