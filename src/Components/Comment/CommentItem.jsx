import { useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaHeart, FaRegHeart, FaReply } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CommentItem({ comment, postId }) {
  const myUserId = localStorage.getItem("userId");
  const isOwner = comment.commentCreator?._id === myUserId;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);

  const isLiked = comment.likes?.includes(myUserId) || false;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  // ============ جيب الـ Replies ============
  const { data: replies = [] } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () =>
      axios
        .get(
          `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies?page=1&limit=10`,
          { headers },
        )
        .then((res) => res.data.data.replies),
    enabled: showReply,
  });

  // ============ Delete Comment ============
  const { mutate: deleteComment } = useMutation({
    mutationFn: () =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        { headers },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  // ============ Update Comment ============
  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("content", editText);
      return axios.put(
        `https://route-posts.routemisr.com/posts/comments/${comment._id}`,
        formData,
        { headers },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setIsEditing(false);
    },
  });

  // ============ Add Reply ============
  const { mutate: addReply, isPending: isReplying } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("content", replyText);
      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
        formData,
        { headers },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
      setReplyText("");
      setRepliesCount((prev) => prev + 1); 
    },
  });


  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios.get("...profile-data").then((res) => res.data.data.user),
  });
  // ============ Like/Unlike Comment ============
  const { mutate: toggleLike } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/comments/${comment._id}/like`,
        {},
        { headers },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  // ============ Delete Reply ============
const { mutate: deleteReply } = useMutation({
  mutationFn: (replyId) =>
    axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${replyId}`,
      { headers },
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
    setRepliesCount((prev) => prev - 1); // ← نقص العدد على طول
  },
});

  // ============ Like/Unlike Reply ============
  const { mutate: toggleReplyLike } = useMutation({
    mutationFn: (replyId) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/comments/${replyId}/like`,
        {},
        { headers },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] }),
  });

  return (
    <div className="flex items-start gap-2">
      {/* Avatar */}
      {comment.commentCreator?.photo ? (
        <img
          src={comment.commentCreator.photo}
          alt={comment.commentCreator.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs font-medium flex-shrink-0">
          {comment.commentCreator?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-1">
        {/* Comment Box */}
        <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-800 dark:text-white">
              {comment.commentCreator?.name || "Unknown"}
            </p>
            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <FaEdit className="text-xs" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure?")) deleteComment();
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 bg-white dark:bg-zinc-700 rounded-lg px-2 py-1 text-sm outline-none text-gray-700 dark:text-gray-300"
              />
              <button
                onClick={() => updateComment()}
                disabled={isUpdating}
                className="text-xs text-purple-600 dark:text-purple-400 font-medium"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              {comment.content}
            </p>
          )}

          {comment.image && (
            <img
              src={comment.image}
              alt="comment"
              className="mt-2 rounded-xl max-h-60 object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={() => toggleLike()}
            className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            {comment.likes?.length || 0}
          </button>

          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition-colors"
          >
            <FaReply />
            Reply {repliesCount > 0 && `(${repliesCount})`}
          </button>

          <p className="text-xs text-gray-400 ml-auto">
            {new Date(comment.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Replies Section */}
        {showReply && (
          <div className="flex flex-col gap-2 pl-4 mt-1">
            {/* Reply Input */}
            <div className="flex items-center gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2 text-sm outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
              <button
                onClick={() => addReply()}
                disabled={replyText.trim().length < 2 || isReplying}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 disabled:opacity-40"
              >
                {isReplying ? "..." : "Reply"}
              </button>
            </div>

            {/* Replies List */}
            {replies.map((reply) => {
              const isReplyLiked = reply.likes?.includes(myUserId) || false;
              const isReplyOwner = reply.commentCreator?._id === myUserId;

              return (
                <div key={reply._id} className="flex items-start gap-2">
                  {reply.commentCreator?.photo ? (
                    <img
                      src={reply.commentCreator.photo}
                      alt={reply.commentCreator.name}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                      {reply.commentCreator?.name?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-800 dark:text-white">
                          {reply.commentCreator?.name || "Unknown"}
                        </p>
                        {isReplyOwner && (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure?"))
                                deleteReply(reply._id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {reply.content}
                      </p>
                      {reply.image && (
                        <img
                          src={reply.image}
                          alt="reply"
                          className="mt-2 rounded-xl max-h-40 object-cover"
                        />
                      )}
                    </div>

                    {/* Reply Actions */}
                    <div className="flex items-center gap-3 px-1">
                      <button
                        onClick={() => toggleReplyLike(reply._id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${isReplyLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                      >
                        {isReplyLiked ? <FaHeart /> : <FaRegHeart />}
                        {reply.likes?.length || 0}
                      </button>
                      <p className="text-xs text-gray-400 ml-auto">
                        {new Date(reply.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
