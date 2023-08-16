import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { Navigate } from "react-router-dom";

const PrivetRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default PrivetRouter;
