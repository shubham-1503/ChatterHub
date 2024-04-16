import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userEmailError, setUserEmailError] = useState("");

  const navigate = useNavigate();
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
    setUserNameError("");
  };

  const handleUserEmailChange = (event) => {
    setUserEmail(event.target.value);
    setUserEmailError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userName) {
      setUserNameError("Username is required");
    }
    if (!userEmail) {
      setUserEmailError("Email is required");
    }
    if(userName && userEmail) {
    navigate("/room", { state: { userName: userName, userEmail: userEmail} });
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center pb-[100px]">
      <p className="text-2xl m-7 font-bold">Enter your credentials</p>
      <div className="items-center w-[448px] flex-col border-2 p-5 rounded-xl">
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="py-5 w-5/6">
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                id="userEmail"
                value={userEmail}
                placeholder="Email"
                onChange={handleUserEmailChange}
                className={`w-full px-3 mb-1 py-2 border-2 text-black ${
                    userEmailError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-blue`}
              />
              {userEmailError && (
                <span className="text-red-500 mb-1 text-sm">
                  {userEmailError}
                </span>
              )}

              <input
                type="text"
                id="userName"
                value={userName}
                placeholder="Username"
                onChange={handleUserNameChange}
                className={`w-full px-3 mb-1 py-2 border-2 text-black ${
                  userNameError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-blue`}
              />
              {userNameError && (
                <span className="text-red-500 mb-1 text-sm">
                  {userNameError}
                </span>
              )}

              <button
                type="submit"
                className="bg-blue flex justify-center text-lg font-semibold items-center w-full mt-2 p-2 rounded-md "
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
