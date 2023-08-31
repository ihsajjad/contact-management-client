import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "./../providers/AuthProviders";
import useAxiosSecure from "./useAxiosSecure";

const useLoadUserData = () => {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();

  const { refetch, data: userData = {} } = useQuery({
    enabled: !!user.email,
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      if (user) {
        const res = await axiosSecure.get(`/contacts/${user?.email}`);
        return res.data;
      }
    },
  });

  return { refetch, userData };
};

export default useLoadUserData;
