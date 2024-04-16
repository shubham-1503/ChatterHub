import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


function Room() {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setError("");
  };

  const location = useLocation();
  console.log(location.state);
  const userName = location.state.userName;
  const userEmail = location.state.userEmail;

  const handleSubmit = async (event) => {
    event.preventDefault();

    isChecked ? createRoom() : (!roomId.trim()) ? setError("Room ID is required") : joinRoom();
  };

  const createRoom = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var generatedRoomId = '';
  
    for (let i = 0; i < 7; i++) {
      generatedRoomId += characters.charAt(Math.floor(Math.random() * characters.length));
    } 

    navigate("/chat", { state: {roomId: generatedRoomId, userName: userName, userEmail: userEmail} });
  };

  const joinRoom = async () => {

    navigate("/chat", { state: { roomId: roomId, userName: userName, userEmail: userEmail} });

  };

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
    setError("");
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <NavBar />
        <p className="text-2xl m-7 font-bold">Welcome {userName}</p>

      <div className="items-center w-[448px] flex-col border-2 p-5 rounded-xl">
        <label className=" flex justify-center cursor-pointer items-center mb-7 mt-5 font-bold text-xl">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <p>Join a room</p>
          <span
            className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
              isChecked ? "bg-blue" : "bg-gray"
            }`}
          >
            <span
              className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                isChecked ? "translate-x-[28px]" : ""
              }`}
            ></span>
          </span>
          <p>Create a room</p>
        </label>
        {/* {isChecked ? <JoinRoom /> : <CreateRoom />} */}

        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 w-5/6">
            {isChecked ? (
              <div className="flex flex-col justify-center items-center">
                <button
                  type="submit"
                  className="bg-blue flex justify-center text-lg font-semibold items-center w-full mt-2 p-2 rounded-md "
                >
                  Create
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  placeholder="Room ID"
                  onChange={handleRoomIdChange}
                  className={`w-full px-3 mb-1 py-2 border-2 text-black ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-blue`}
                />
                {error && <span className="text-red-500 mb-1 text-sm">{error}</span>}
                <button
                  type="submit"
                  className="bg-blue flex justify-center text-lg font-semibold items-center w-full mt-2 p-2 rounded-md "
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Room;
