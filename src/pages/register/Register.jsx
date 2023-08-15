import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Register = () => {
  const [error, setError] = useState("");

  const { createUser, googleSignIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // handling sign up
  const handleSignUp = (data) => {
    setError("");
    const { email, password, confirm } = data;

    console.log(data);
    // matching password
    if (password !== confirm) {
      return setError("Password doesn't match");
    }

    // creating new user using email and password
    createUser(email, password)
      .then((result) => {
        const newUser = result.user;
        if (newUser) {
          // updating user's name and profile
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // handle google login
  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        const newUser = result.user;
        console.log(newUser);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="hero min-h-screen md:py-12 p-5">
      <div className="card md:w-1/3 w-full shadow-2xl bg-base-100 border-[var(--main-color)] border-2">
        <h2 className="text-3xl font-bold text-center mt-8">
          Please Register!
        </h2>
        <form onSubmit={handleSubmit(handleSignUp)} className="card-body">
          <div className="flex flex-col ">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                {...register("name", { required: true })}
                className="input input-bordered"
                required
              />
              {errors.name && (
                <span className="text-red-500">Name is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="input input-bordered"
                required
              />
              {errors.email && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[A-Z])(?=.*[!@#$&%*])(?=.*[0-9])(?=.*[a-z])/,
                })}
                className="input input-bordered"
                required
              />
              {errors.password?.type === "required" && (
                <span className="text-red-400">Password is required</span>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-400">
                  Password must have minimum six characters.
                </p>
              )}
              {errors.password?.type === "maxLength" && (
                <span className="text-red-400">
                  Password must be less than 20 characters.
                </span>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-400">
                  Password must have a special character
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password*</span>
              </label>
              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                {...register("confirm", { required: true })}
                className="input input-bordered"
                required
              />
            </div>
          </div>
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <div className="form-control mb-0">
            <button className="btn btn-primary">Register</button>
          </div>
        </form>
        <div className="divider">OR</div>
        <div className="text-center text-xl ">
          <button onClick={handleGoogleLogin} className=" p-2 rounded-full">
            <img
              src="/src/assets/google-icon.png"
              alt=""
              className="h-12 w-12"
            />
          </button>
        </div>
        {/* Socials sign in including google */}

        <p className="text-center mb-4">
          Already have an account? please{" "}
          <Link to="/login" className="underline text-[var(--main-color)]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
