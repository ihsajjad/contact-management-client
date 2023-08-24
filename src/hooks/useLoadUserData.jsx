import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./../providers/AuthProviders";

const useLoadUserData = () => {
  const { user } = useContext(AuthContext);

  const { refetch, data: userData = {} } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/contacts/${user?.email}`
      );
      return res.data;
    },
  });

  return { refetch, userData };
};

export default useLoadUserData;
