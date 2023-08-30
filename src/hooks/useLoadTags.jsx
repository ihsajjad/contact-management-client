import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "./useAxiosSecure";

const useLoadTags = (id) => {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();
  const { refetch, data: tags = [] } = useQuery({
    enabled: !!id && !!user.email,
    queryKey: ["tags", user, id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/get-contact/${user?.email}/${id}`);
      return res.data?.tags;
    },
  });

  return { refetch, tags };
};

// export default React.memo(useLoadTags);
export default useLoadTags;
