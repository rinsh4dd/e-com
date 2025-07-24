import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import Silk from "../../common/ui/Silk";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../../common/context/AuthProvider";
import { URL } from "../../service/api";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user,setUser, login } = useContext(AuthContext);
  const images = [
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/46f6a122-0450-4b19-8808-5604a2afe847/JORDAN+LUKA+4+PF.png",
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/52642011-bfc1-4af4-975b-02f6f2b15ec3/JORDAN+LUKA+4+PF.png",
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/97299918-87e5-4dc4-b441-b048cb837215/JORDAN+LUKA+4+PF.png",
  ];
  if(user){
    navigate('/')
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${URL}/users?email=${form.email}&password=${form.password}`
      );

      if (data.length > 0) {
        const loggedInUser = data[0];

        if (loggedInUser.isBlocked) {
          toast.error("Your account is blocked. Contact admin.");
          return;
        }

        if (loggedInUser.role === "admin") {
          setUser(loggedInUser);
          toast.success("Welcome Admin!");
          setTimeout(
            () => navigate("/admin/dashboard", { replace: true }),
          );
        } else {
          login(loggedInUser); // save to context + localStorage
          toast.success("Login successful! Redirecting...");
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="absolute inset-0 z-0">
        <Silk speed={5} color="#7B7481" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex w-full max-w-5xl bg-white bg-opacity-30 rounded-xl shadow-lg overflow-hidden backdrop-blur-md border border-white border-opacity-20"
      >
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.99 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"
          >
            <img
              src={images[currentImage]}
              alt="Shoe Display"
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center text-white">
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold mb-4 drop-shadow-lg"
                >
                  Welcome Back
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl opacity-90 drop-shadow-lg"
                >
                  Step into your account
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
              <div
                className="absolute inset-y-0 top-7 right-3 flex items-center cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:bg-blue-700 transition flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default LoginPage;
