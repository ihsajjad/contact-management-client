import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAxiosSecure = () => {
  const { logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingAxios, setLoadingAxios] = useState(false);

  const axiosSecure = axios.create({
    baseURL: "https://contact-management-server-ihsajjad.vercel.app",
  });

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      setLoadingAxios(true);
      const token = localStorage.getItem("access-token");
      if (token && !loading) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        setLoadingAxios(false);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate, axiosSecure, loading]);

  return { axiosSecure, loadingAxios };
};

export default useAxiosSecure;
