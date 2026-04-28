
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function GuestRoute({ children }) {
  const { userLogin } = useContext(AuthContext);

  if (userLogin !== null) {
    return <Navigate to="/home" />;
  }

  return children;
}
