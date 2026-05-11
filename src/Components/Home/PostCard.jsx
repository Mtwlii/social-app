import { useRef, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShareAlt,
  FaEllipsisV,
  FaGlobe,
  FaSpinner,
  FaTrash,
  FaEdit,
  FaImage,
  FaTimes,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PostCard({ post }) {
  const myUserId = localStorage.getItem("userId");
  const isOwner = post?.user?._id === myUserId;
  const queryClient = useQueryClient();

  const isBookmarked = post?.bookmarked || false;

  const [liked, setLiked] = useState(post?.likes?.includes(myUserId) || false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(
    post?.topComment ? [post.topComment] : [],
  );
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editImagePreview, setEditImagePreview] = useState(post?.image || null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareBody, setShareBody] = useState("");

  const fileInputRef = useRef(null);
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { body: post?.body || "", image: null },
  });

  // ============ Get Profile ============
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/profile-data", {
          headers,
        })
        .then((res) => res.data.data.user),
  });

  // ============ Bookmark ============
  const { mutate: toggleBookmark, isPending: isBookmarking } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
        {},
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
  });

  // ============ Delete Post ============
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
        headers,
      }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        queryClient.invalidateQueries({ queryKey: ["userPosts", myUserId] });
    },
  });

  // ============ Update Post ============
  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: (formData) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${post._id}`,
        formData,
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      setIsEditing(false);
    },
  });

  // ============ Share Post ============
  const { mutate: sharePost, isPending: isSharing } = useMutation({
    mutationFn: () =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${post._id}/share`,
        { body: shareBody },
        { headers: { ...headers, "Content-Type": "application/json" } },
      ),
    onSuccess: () => {
      toast.success("Post shared successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      setShowShareModal(false);
      setShareBody("");
    },
    onError: () => {
      toast.error("Failed to share post!");
    },
  });

  function onEditSubmit(data) {
    const formData = new FormData();
    formData.append("body", data.body);
    if (data.image?.[0]) formData.append("image", data.image[0]);
    updatePost(formData);
  }

  function handleLike() {
    if (isLiking) return;
    setIsLiking(true);
    axios
      .put(
        `https://route-posts.routemisr.com/posts/${post._id}/like`,
        {},
        { headers },
      )
      .then(() => {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      })
      .catch(console.log)
      .finally(() => setIsLiking(false));
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    setIsCommenting(true);
    const formData = new FormData();
    formData.append("content", commentText);
    axios
      .post(
        `https://route-posts.routemisr.com/posts/${post._id}/comments`,
        formData,
        { headers },
      )
      .then((res) => {
        setComments((prev) => [res.data.data.comment, ...prev]);
        setCommentText("");
      })
      .catch(console.log)
      .finally(() => setIsCommenting(false));
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {post?.user?.photo ? (
          <img
            src={post.user.photo}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium text-sm flex-shrink-0">
            {post?.user?.name?.charAt(0) || "U"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link
            to={
              post?.user?._id === myUserId
                ? "/profile"
                : `/users/${post?.user?._id}`
            }
            className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
          >
            {post?.user?.name || "Unknown"}
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400">
              @{post?.user?.username || "username"} -{" "}
              {new Date(post?.createdAt).toLocaleDateString("en-GB")} -{" "}
              {new Date(post?.createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center gap-1">
              <FaGlobe className="text-xs" /> {post?.privacy || "public"}
            </span>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FaEllipsisV className="text-sm" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-lg z-10 overflow-hidden w-32">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <FaEdit className="text-blue-500" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure?")) deletePost();
                  }}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  {isDeleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}{" "}
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="px-4 pb-4 flex flex-col gap-3"
        >
          <textarea
            rows={3}
            className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 outline-none resize-none"
            {...register("body", { required: true, minLength: 2 })}
          />
          {editImagePreview && (
            <div className="relative w-full">
              <img
                src={editImagePreview}
                className="w-full max-h-60 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setValue("image", null);
                  setEditImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
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
                  if (file) setEditImagePreview(URL.createObjectURL(file));
                }}
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                {isUpdating ? <FaSpinner className="animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          {/* Body */}
          {post?.body && (
            <p className="px-4 pb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.body}
            </p>
          )}

          {/* Shared Post */}
          {post?.sharedPost && (
            <div className="mx-4 mb-3 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                {post.sharedPost.user?.photo ? (
                  <img
                    src={post.sharedPost.user.photo}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-xs font-medium">
                    {post.sharedPost.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-white">
                    {post.sharedPost.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{post.sharedPost.user?.username}
                  </p>
                </div>
              </div>
              {post.sharedPost.body && (
                <p className="px-3 pb-2 text-sm text-gray-600 dark:text-gray-300">
                  {post.sharedPost.body}
                </p>
              )}
              {post.sharedPost.image && (
                <img
                  src={post.sharedPost.image}
                  className="w-full max-h-60 object-cover"
                />
              )}
            </div>
          )}

          {/* Image */}
          {post?.image && (
            <img
              src={post.image}
              alt="post"
              className="w-full object-cover max-h-80"
            />
          )}
        </>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <FaHeart className="text-white text-xs" />
          </div>
          <span className="text-xs text-gray-500">{likesCount}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs text-gray-400">
            {post?.commentsCount || 0} comments
          </span>
          <span className="text-xs text-gray-400">
            {post?.sharesCount || 0} shares
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex border-t border-gray-100 dark:border-zinc-700">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 ${
            liked ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isLiking ? (
            <FaSpinner className="animate-spin" />
          ) : liked ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
          Like
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 ${
            showComments
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <FaRegComment /> Comment
        </button>
        {isOwner ? (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed"
          >
            <FaShareAlt /> Share
          </button>
        ) : (
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <FaShareAlt /> Share
          </button>
        )}
        <button
          onClick={() => toggleBookmark()}
          disabled={isBookmarking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 ${
            isBookmarked
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isBookmarking ? (
            <FaSpinner className="animate-spin" />
          ) : isBookmarked ? (
            <FaBookmark />
          ) : (
            <FaRegBookmark />
          )}
          Save
        </button>
      </div>

      {/* Comments Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${showComments ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-100 dark:border-zinc-700 px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {user?.photo ? (
              <img
                src={user.photo}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xs font-medium flex-shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isCommenting}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 disabled:opacity-40 transition-opacity"
              >
                {isCommenting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Comment"
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-2">
                  {comment.commentCreator?.photo ? (
                    <img
                      src={comment.commentCreator.photo}
                      alt={comment.commentCreator.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs font-medium flex-shrink-0">
                      {comment.commentCreator?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                    <p className="text-xs font-medium text-gray-800 dark:text-white mb-0.5">
                      {comment.commentCreator?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {comments.length > 0 && (
            <Link
              to={`/posts/${post._id}`}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline text-center py-1"
            >
              See all comments →
            </Link>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Share Post
              </h3>
            </div>

            {/* الـ post الأصلي */}
            <div className="px-4 py-3 border border-gray-100 dark:border-zinc-700 rounded-xl m-4">
              <div className="flex items-center gap-2 mb-2">
                {post?.user?.photo ? (
                  <img
                    src={post.user.photo}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-xs font-medium">
                    {post?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  {post?.user?.name}
                </p>
              </div>
              {post?.body && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.body}
                </p>
              )}
              {post?.image && (
                <img
                  src={post.image}
                  className="mt-2 rounded-lg max-h-32 object-cover w-full"
                />
              )}
            </div>

            <div className="px-4 pb-3">
              <textarea
                value={shareBody}
                onChange={(e) => setShareBody(e.target.value)}
                placeholder="Say something about this post..."
                rows={3}
                className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none resize-none"
              />
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-700">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareBody("");
                }}
                className="flex-1 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => sharePost()}
                disabled={isSharing}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSharing ? <FaSpinner className="animate-spin" /> : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
