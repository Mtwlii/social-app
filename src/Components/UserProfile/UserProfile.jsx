import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import PostCard from "../Home/PostCard";
import { Helmet } from "react-helmet";

export default function UserProfile() {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const myUserId = localStorage.getItem("userId");
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  // ============ get user profile =============
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/${userId}/profile`, {
          headers,
        })
        .then((res) => res.data.data.user),
  });

  // ============ get user posts =============
  const { data: posts = [] } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
          headers,
        })
        .then((res) => res.data.data.posts),
  });

  // ============ Follow/Unfollow ============
  const isFollowing =
    user?.followers?.some((f) => (f._id || f) === myUserId) || false;

  const { mutate: toggleFollow, isPending: isFollowing_ } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-zinc-700 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 flex flex-col gap-4">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Profile | {user?.name}</title>
        <link rel="icon" href="http://mysite.com/example" />
      </Helmet>
      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-purple-500 to-blue-500" />

        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-10 mb-3">
            {/* Avatar */}
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-2xl font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}

            {/* Follow Button */}
            {myUserId !== userId && (
              <button
                onClick={() => toggleFollow()}
                disabled={isFollowing_}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2  cursor-pointer ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isFollowing_ ? (
                  <FaSpinner className="animate-spin" />
                ) : isFollowing ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>

          {/* Info */}
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-sm text-gray-400">@{user?.username}</p>

          {/* Stats */}
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {posts.length}
              </p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.followers?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.following?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No posts yet.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
