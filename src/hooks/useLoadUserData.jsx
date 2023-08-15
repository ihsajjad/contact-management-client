import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useLoadUserData = () => {
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("users.json");
      return res.data;
    },
  });

  return { refetch, users };
};

export default useLoadUserData;
