import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import BackgroundImage from "../../assets/images/bg.jpg";
import socket from "../../configs/socket";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [isLogginIn, setLogginIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  useEffect(() => {
    document.title = "Login";
    let isMounted = true;
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setErrorMessage("Please input email and password.");
      return;
    }

    setLogginIn(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok || !data.token || !data.user) {
        setErrorMessage(data.msg || "Invalid email or password.");
        setLogginIn(false);
        return;
      }

      // Store user info
      localStorage.setItem("chattoken", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.name);

      // Notify socket and redirect
      socket.emit("user-login", data.user.id);
      history.push("/chat");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLogginIn(false);
    }
  };

  if (localStorage.getItem("chattoken")) {
    return <Redirect to="/chat" />;
  }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex shadow-xl">
            <div
              className="w-full h-auto hidden lg:block lg:w-1/2 bg-cover bg-center rounded-l-lg"
              style={{ backgroundImage: `url(${BackgroundImage})` }}
            ></div>

            <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
              <h3 className="pt-4 text-2xl text-center">Chat App!</h3>
              <form
                className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="email"
                    placeholder="Email"
                    ref={emailRef}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                  />
                  {errorMessage && (
                    <p className="text-xs italic text-red-500">{errorMessage}</p>
                  )}
                </div>
                <div className="mb-4">
                  <input className="mr-2 leading-tight" type="checkbox" />
                  <label className="text-sm">Remember Me</label>
                </div>
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isLogginIn}
                  >
                    {isLogginIn ? "Signing In..." : "Sign In"}
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <Link
                    to="/register"
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                  >
                    Don’t have an account? Register Now!
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
