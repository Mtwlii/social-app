import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userLogin, setUserLogin] = useState(
    () => localStorage.getItem("userToken") || null,
  );

  // useEffect(() => {
  //   if (localStorage.getItem("userToken")) {
  //     setUserLogin(localStorage.getItem("userToken"));
  //   }
  // }, []);

  const [userDataEmail, setUserDataEmail] = useState(
    () => localStorage.getItem("userDataEmail") || null,
  );

  // useEffect(() => {
  //   if (localStorage.getItem("userDataEmail")) {
  //     setUserDataEmail(localStorage.getItem("userDataEmail"));
  //   }
  // }, []);
  // console.log(userDataEmail);

  return (
    <>
      <AuthContext.Provider
        value={{ userLogin, setUserLogin, userDataEmail, setUserDataEmail }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
