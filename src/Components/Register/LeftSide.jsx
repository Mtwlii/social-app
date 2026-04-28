import React from "react";
import {
  FaComments,
  FaImage,
  FaBell,
  FaUsers,
  FaStar,
  FaUserFriends,
  FaHeart,
  FaRegComment,
} from "react-icons/fa";

const LeftSide = () => {
  const features = [
    {
      icon: <FaComments className="text-green-400 text-xl" />,
      title: "Real-time Chat",
      sub: "Instant messaging",
    },
    {
      icon: <FaImage className="text-blue-300 text-xl" />,
      title: "Share Media",
      sub: "Photos & videos",
    },
    {
      icon: <FaBell className="text-yellow-300 text-xl" />,
      title: "Smart Alerts",
      sub: "Stay updated",
    },
    {
      icon: <FaUsers className="text-green-400 text-xl" />,
      title: "Communities",
      sub: "Find your tribe",
    },
  ];

  const stats = [
    { icon: <FaUserFriends />, num: "2M+", label: "Active Users" },
    { icon: <FaHeart />, num: "10M+", label: "Posts Shared" },
    { icon: <FaRegComment />, num: "50M+", label: "Messages Sent" },
  ];

  return (
    <div
      className="relative flex flex-col justify-between p-10 rounded-3xl overflow-hidden h-full"
      style={{ minHeight: "600px" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Blue overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(21,101,192,0.92) 0%, rgba(25,118,210,0.88) 50%, rgba(66,165,245,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#7a9eef] bg-opacity-20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            SocialHub
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome Back
          </h1>
          <h2
            className="text-4xl font-extrabold leading-tight mb-3"
            style={{ color: "#90CAF9" }}
          >
            to SocialHub App
          </h2>
          <p className="text-blue-100 text-sm">
            Signin to connect people all over the world
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:scale-105 transition-transform duration-200"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>{f.icon}</span>
              <div>
                <p className="text-white text-sm font-semibold">{f.title}</p>
                <p className="text-blue-100 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <div className="flex items-center gap-1 text-white mb-0.5">
                <span className="text-sm">{s.icon}</span>
                <span className="font-bold text-xl">{s.num}</span>
              </div>
              <span className="text-blue-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Testimonial */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex text-yellow-400 mb-3 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-base" />
            ))}
          </div>
          <p className="text-white text-sm italic leading-relaxed mb-4">
            "SocialHub has completely changed how I connect with friends and
            discover new communities. The experience is seamless!"
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Alex Johnson"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-white text-sm font-semibold italic">
                Alex Johnson
              </p>
              <p className="text-blue-200 text-xs">Product Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
