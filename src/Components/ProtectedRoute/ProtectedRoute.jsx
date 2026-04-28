
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { userLogin } = useContext(AuthContext);

  if (userLogin === null) {
    return <Navigate to="/login" />;
  }

  return children;
}
