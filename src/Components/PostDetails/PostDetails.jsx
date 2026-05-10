import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShareAlt,
  FaGlobe,
  FaSpinner,
} from "react-icons/fa";
import CommentsSection from "./../Comment/CommentsSection";
import { Helmet } from "react-helmet";

export default function PostDetails() {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/posts/${postId}`, { headers })
        .then((res) => res.data.data.post),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      axios
        .get(
          `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
          { headers },
        )
        .then((res) => res.data.data.comments),
  });

  const myUserId = localStorage.getItem("userId");
  const liked = post?.likes?.includes(myUserId) || false;
  const likesCount = post?.likesCount || 0;

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-zinc-700 border-t-purple-600 dark:border-t-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 flex flex-col gap-4">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Post Details of {post?.user?.name}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {post && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            {post.user?.photo ? (
              <img
                src={post.user.photo}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                {post.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.user?.name}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">
                  @{post.user?.username} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-GB")}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center gap-1">
                  <FaGlobe className="text-xs" /> {post.privacy}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          {post.body && (
            <p className="px-4 pb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.body}
            </p>
          )}

          {/* Image */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="w-full object-cover max-h-80"
            />
          )}

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <FaHeart className="text-white text-xs" />
              </div>
              <span className="text-xs text-gray-500">{likesCount}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-xs text-gray-400">
                {comments.length} comments
              </span>
              <span className="text-xs text-gray-400">
                {post.sharesCount || 0} shares
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex border-t border-gray-100 dark:border-zinc-700">
            <button
              onClick={() => toggleLike()}
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
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <FaRegComment /> Comment
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      )}

      <CommentsSection
        postId={postId}
        comments={comments}
        postUserName={post?.user?.name}
      />
    </div>
  );
}
