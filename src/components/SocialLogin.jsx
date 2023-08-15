import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const { googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // handle google login
  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        if (user) {
          navigate("/");
        }
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="text-center text-xl ">
      <button onClick={handleGoogleLogin} className=" p-2 rounded-full">
        <img src="/src/assets/google-icon.png" alt="" className="h-12 w-12" />
      </button>
    </div>
  );
};

export default SocialLogin;
