import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../Post/PostCard";

export default function Bookmarks() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/bookmarks", { headers })
        .then((res) => res.data.data.bookmarks),
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
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Bookmarks
      </h2>
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">
          No bookmarks yet.
        </p>
      ) : (
        bookmarks.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
