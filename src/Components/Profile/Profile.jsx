import { useRef, useState } from "react";
import axios from "axios";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import PostCard from "../Home/PostCard";
import Loading from "../Loading/Loading";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export default function Profile() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();

  const myUserId = localStorage.getItem("userId");
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  // ============ جيب بيانات المستخدم ============
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/profile-data", {
          headers,
        })
        .then((res) => res.data.data.user),
  });

  // ============ جيب بوستات المستخدم ============
  const { data: posts = [] } = useQuery({
    queryKey: ["userPosts", myUserId],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/${myUserId}/posts`, {
          headers,
        })
        .then((res) => res.data.data.posts),
  });

  // ============ رفع صورة ============
  const { mutate: uploadPhoto, isPending: isUploading } = useMutation({
    mutationFn: (formData) =>
      axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        { headers },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowCropModal(false);
      setImgSrc("");
    },
  });

  // لما المستخدم يختار صورة
  function onSelectFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result?.toString() || "");
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // لما الصورة تتحمل في الـ crop
  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1)); // 1 = مربع
  }

  // لما يضغط Save
  async function handleCropSave() {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("photo", blob, "profile.jpg");
      uploadPhoto(formData);
    }, "image/jpeg");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-zinc-700 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 flex flex-col gap-4">
      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-500 to-blue-500" />
        <div className="px-4 pb-4">
          <div className="relative w-20 h-20 -mt-10 mb-3">
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
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              {isUploading ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaCamera className="text-xs" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelectFile}
            />
          </div>

          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-sm text-gray-400">@{user?.username}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>

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

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Crop Profile Photo
              </h3>
            </div>

            <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="crop"
                    onLoad={onImageLoad}
                    className="max-h-80 object-contain"
                  />
                </ReactCrop>
              )}
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-700">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImgSrc("");
                }}
                className="flex-1 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                disabled={isUploading || !completedCrop}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? <FaSpinner className="animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
