import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Components/Notfound/Notfound";
import CounterContextProvider from "./Context/CounterContext";
import Profile from "./Components/Profile/Profile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "./Components/ProtectedRoute/GuestRoute";
import AuthContextProvider from "./Context/AuthContext";
import { DarkModeProvider } from "./Context/DarkModeContext";
import PostDetails from "./Components/PostDetails/PostDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "./Components/UserProfile/UserProfile";
import DetectOffline from "./Components/DetectOffline/DetectOffline";
import { useNetworkState } from "react-use";
import { Toaster } from "react-hot-toast";
import ChangePassword from './Components/ChangePassword/ChangePassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:postId",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  { path: "*", element: <Notfound /> },
]);

const queryClient = new QueryClient();
const App = () => {
    const { online } = useNetworkState();
  return (
    <>
      {!online && <DetectOffline />}

      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <AuthContextProvider>
            <CounterContextProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  success: {
                    style: {
                      background: "#7c3aed", // purple-600
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "14px",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#7c3aed",
                    },
                  },
                  error: {
                    style: {
                      background: "#ef4444", // red-500
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "14px",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#ef4444",
                    },
                  },
                }}
              />
              <RouterProvider router={router} />
            </CounterContextProvider>
          </AuthContextProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
