import "./Auth.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import SigninForm from './SigninForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen relative authContainer">
      <div className="absolute inset-0 bg-transparent backdrop-blur-sm">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          flex flex-col justify-center items-center h-[35rem] w-[30rem]
          rounded-md z-50 bg-transparent shadow-2xl shadow-white">

          <h1 className="text-6xl font-bold pb-9 text-white">Zosh Trading</h1>

          {location.pathname === "/signup" ? (
            <section className="w-full px-8">
              <SignupForm />
              <div className="flex items-center justify-center gap-2 mt-4 text-white">
                <span>Already have an account?</span>
                <Button onClick={() => navigate("/signin")} variant="ghost" className="text-blue-400 underline">
                  Sign In
                </Button>
              </div>
            </section>
          ) : location.pathname === "/forgot-password" ? (
            <section className="w-full px-8">
              <ForgotPasswordForm />
              <div className="flex items-center justify-center gap-2 mt-4 text-white">
                <span>Back to login page.</span>
                <Button onClick={() => navigate("/signin")} variant="ghost" className="text-blue-400 underline">
                  Sign In
                </Button>
              </div>
            </section>
          ) : (
            <section className="w-full px-8">
              <SigninForm />
              <div className="flex items-center justify-center gap-2 mt-4 text-white">
                <span>Don't have an account?</span>
                <Button onClick={() => navigate("/signup")} variant="ghost" className="text-blue-400 underline">
                  Sign Up
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-white">
                <span>Forgot password?</span>
                <Button onClick={() => navigate("/forgot-password")} variant="ghost" className="text-blue-400 underline">
                  Reset
                </Button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;
