// import React, { useEffect, useState } from "react";
import Profile from "../Profile/Profile";
import axios from "axios";
import PostCard from "./PostCard";
import Loading from "../Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../CreatePost/CreatePost";
import { Helmet } from "react-helmet";

const Home = () => {
  // const [allPosts, setAllPosts] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      params: {
        sort: "-createdAt",

        limit: 100,
      },

      //   })
      //   .then((res) => {
      //     // console.log(res.data.data.posts);
      //     setAllPosts(res.data.data.posts);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     setIsError(true);
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
    });
  }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
    // refetchOnWindowFocus: true,
    // refetchInterval: 1000 *60 *60,
    refetchIntervalInBackground: true,
    // maxPages: 10,
    retry: 3,
    retryDelay: 5000,
    // staleTime: 10000 ,
    // gcTime: 10000,
    enabled: !!localStorage.getItem("userToken"),
  });
  // console.log(data?.data?.data.posts);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="flex flex-col gap-4 max-w-xl mx-auto justify-center h-screen pt-20 py-6 px-4">
        <div className="text-center flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-white p-5 border shadow-lg shadow-red-500/50 text-red-500 rounded">
            Something went wrong please try again later or contact support ....
          </h1>
        </div>
        <div className="text-center py-2 ">
          <h2 className="text-2xl font-bold">
            We are ready to serve you please be patient 🥱
          </h2>
        </div>
        <div className="text-center py-2">
          <h2 className="text-2xl font-bold">Error: {error.message}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto pt-20 py-6 px-4">
       <Helmet>
              <meta charSet="utf-8" />
              <title>Home</title>
              <link rel="icon" href="http://mysite.com/example" />
            </Helmet>
      <CreatePost />
      {data?.data?.data.posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Home;
