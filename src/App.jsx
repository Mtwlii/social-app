import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Components/Notfound/Notfound";
import CounterContextProvider from "./Context/CounterContext";
import Profile from "./Components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import GuestRoute from "./Components/ProtectedRoute/GuestRoute";


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
      { path: "*", element: <Notfound /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
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
const App = () => {
  return (
    <>
      <AuthContextProvider>
        <CounterContextProvider>
          <RouterProvider router={router}></RouterProvider>
        </CounterContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
