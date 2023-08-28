import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";

const useLoadTags = (id) => {
  const { user } = useContext(AuthContext);

  const { refetch, data: tags = [] } = useQuery({
    enabled: !!id && !!user.email,
    queryKey: ["tags", user, id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/get-contact/${user?.email}/${id}`
      );
      return res.data?.tags;
    },
  });

  return { refetch, tags };
};

// export default React.memo(useLoadTags);
export default useLoadTags;
