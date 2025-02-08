import { useState, useEffect, use } from "react";
import { Card, Input, Button, Typography, Spinner } from "@material-tailwind/react";
import toast from "react-hot-toast";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/reduxStore/hooks";
import { SetLoader } from "@/reduxStore/slices/userSlice";

export default function LogIn() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(SetLoader(false));
  }, []);

  const router = useRouter();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitCounter, setSubmitCounter] = useState(0);

  // State for form errors
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Validation logic
  const validateEmail = (emailValue: string) => {
    if (!emailValue) {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return "Enter a valid email";
    }
    return "";
  };

  const validatePassword = (passwordValue: string) => {
    if (!passwordValue) {
      return "Password is required";
    }
    return "";
  };

  // UseEffect for email validation
  useEffect(() => {
    if (!submitCounter) return;
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(email),
    }));
  }, [email]);

  // UseEffect for password validation
  useEffect(() => {
    if (!submitCounter) return;
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(password),
    }));
  }, [password]);

  // Submit handler
  const handleSubmit = (e: any) => {
    setSubmitCounter(1);
    e.preventDefault();

    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);
    setErrors({ email: isValidEmail, password: isValidPassword });

    if (!isValidEmail && !isValidPassword) {
      setSubmitCounter(2);
      toast.success("Successfully toasted!");
      // Add further logic for login, e.g., API call
    }
  };

  const logInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;

        toast.success("Google Sign-In successful!");
        router.push("/");
      })
      .catch((error) => {
        toast.error("Google Sign-In failed!");
      });
  };

  const logInWithApple = () => {
    const appleProvider = new OAuthProvider("apple.com");

    signInWithPopup(auth, appleProvider)
      .then((result) => {
        const user = result.user;

        toast.success("Apple Sign-In successful!");
        router.push("/");
      })
      .catch((error) => {
        toast.error("Apple Sign-In failed!");
        console.error("Error:", error.message);
      });
  };

  const logInWithUsernameAndPassword = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const user = result.user;

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      toast.error("Login failed! Please check your credentials.");
      console.error("Error:", error.message);
    }
  };

  return (
    <Card
      color="transparent"
      shadow={false}
      className="rounded-xl   p-10  shadow-2xl backdrop-blur bg-white/20"
    >
      <Typography variant="h4" color="blue-gray" className="text-primary">
        Log In
      </Typography>
      <Typography className="mt-1 font-normal font-sourGummy text-secondary">
        Nice to meet you! Enter your details to login
      </Typography>

      <br />

      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          {/* Social Log in */}

          <section className="flex gap-2">
            <Button
              size="sm"
              className="flex items-center justify-center gap-3 w-full bg-transparent border border-white/30"
              onClick={() => logInWithGoogle()}
            >
              <img
                src="https://docs.material-tailwind.com/icons/google.svg"
                alt="metamask"
                className="h-5 w-5"
              />
              Google
            </Button>

            <Button
              size="sm"
              onClick={() => logInWithApple()}
              className="flex items-center justify-center gap-3 w-full bg-transparent border border-white/30"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/0/747.png"
                alt="metamask"
                className="h-5 w-5"
              />
              Apple
            </Button>
          </section>

          <div className="flex items-center  gap-2">
            <hr className="w-full " />
            <p className="text-nowrap text-white/50">Or Continue With</p>
            <hr className="w-full " />
          </div>

          {/* End Social Log in */}

          <aside>
            <Input
              type="text"
              label="Enter Email"
              className="text-primary disabled:bg-secondary disabled:bg-opacity-20    "
              onChange={(e) => setEmail(e.target.value)}
              error={!!submitCounter && errors.email != ""}
              success={!!submitCounter && errors.email == ""}
              disabled={submitCounter > 1}
            />
            <Typography
              variant="small"
              color="red"
              className={`mt-2 flex items-center gap-1 font-normal text-xs first-line: disabled:border ${
                errors.email == "" ? "hidden" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.email}
            </Typography>
          </aside>

          <aside>
            <Input
              type="password"
              label="Enter Password"
              className="text-primary disabled:bg-secondary disabled:bg-opacity-20"
              onChange={(e) => setPassword(e.target.value)}
              error={!!submitCounter && errors.password != ""}
              success={!!submitCounter && errors.password == ""}
              disabled={submitCounter > 1}
            />
            <Typography
              variant="small"
              color="red"
              className={`mt-2 flex items-center gap-1 font-normal text-xs first-line: ${
                errors.password == "" ? "hidden" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.password}
            </Typography>
          </aside>
        </div>
        <br />

        <Button
          className="mt-6  bg-secondary flex items-center justify-center gap-3 text-primary"
          disabled={submitCounter > 1 || !email || !password}
          onClick={() => logInWithUsernameAndPassword(email, password)}
          fullWidth
        >
          {submitCounter > 1 ? (
            <>
              <Spinner />
              Logging In . . .
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>
    </Card>
  );
}
