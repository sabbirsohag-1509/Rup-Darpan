import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";

const UserRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Auth checking
  if (loading) {
    return <Loader />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin trying to access user dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Normal user
  return children;
};

export default UserRouter;