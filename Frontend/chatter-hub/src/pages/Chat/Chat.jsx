import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import AWS from "aws-sdk";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


function Chat() {
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socketClient, setSocketClient] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const location = useLocation();
  console.log(location.state);
  const roomId = location.state.roomId;
  const userName = location.state.userName;
  const userEmail = location.state.userEmail;

  useEffect(() => {
    //setting up socket connection with server which is running on port 4000
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    //update the useState
    setSocketClient(socket);
    console.log(socket);

    return () => {
      if (socketClient) {
        socket.disconnect();
      }
    };

  }, []);

  useEffect(() => {
    if (socketClient) {
      socketClient.emit("joinRoom", {
        roomId: roomId,
        userName: userName,
        userEmail: userEmail,
      });

      socketClient.on("previousMessages", (data) => {
        // Extract previous messages received from the server
        const previousMessages = data.messages;
        console.log("previous message:", previousMessages);
        // Update the messages state with previous messages
        setMessages(previousMessages);
      });

      socketClient.on("server-message", (data) => {
        console.log(data);
        // Extract relevant properties for the received message
        const newMessage = {
          userName: data.userName,
          userEmail: data.userEmail,
          content: data.content,
          sentAt: data.sentAt, // Make sure you have this property in your data
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socketClient.on("updateUserList", (data) => {
        // Update the users state with the new user list received from the server
        setUsers(data.userslist);
      });

      socketClient.on("messageUpdate", (data) => {
        console.log(data);
        // Extract relevant properties for the received message
        const newMessage = {
          userName: data.userName,
          userEmail: data.userEmail,
          content: data.content,
          sentAt: data.sentAt, // Make sure you have this property in your data
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [socketClient]);

  const sendMessage = () => {
    if (socketClient && messageInput.trim() !== "") {
      // Emit message to the server
      socketClient.emit("sendMessage", {
        roomId: roomId,
        userName: userName,
        userEmail: userEmail,
        content: messageInput,
        sentAt: new Date().toISOString(),
      });

      // Clear message input
      setMessageInput("");
    }
  };

  const formatTimestamp = (timestamp) => {
    console.log(timestamp);
    const date = new Date(timestamp);
    const options = {
      timeZone: "America/Halifax",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleTimeString("en-US", options);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && messageInput.trim() !== "") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubscribe = () => {

    const data = {
      userEmail: userEmail
    };

    axios.post(import.meta.env.VITE_LAMBDA_URL+"subscribe", data)
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });   

    setSubscribed(!subscribed);

    if(subscribed){
      toast.success(`unSubscribed successfully`);
    }else{
      toast.success(`Subscribed successfully`);
    }    
  }

  const handlePoke = (user) => {

    const data = {
      userEmail: user.userEmail
    };

    axios.post(import.meta.env.VITE_LAMBDA_URL+"sendNotification", data)
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })

    toast.success(`Poked ${user.userName}`);

  };

  return (
    <>
      <div className="h-screen flex flex-col items-center overflow-hidden">
        <NavBar />
        <ToastContainer />
        <div className="w-5/6 h-[600px] flex flex-col">
          <div className="p-3 px-7 flex flex-row rounded-t-[18px] justify-between items-center bg-black font-bold text-2xl text-white">
            <div className="flex flex-row justify-center items-center gap-7">
            <div className="text-xl"> Room Id: {roomId}</div>
            <button className="bg-white text-lg px-6 py-1 text-black rounded-full" onClick={handleSubscribe}>{subscribed?"unSubscribed":"Subscribe"}</button>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <div>{userName ? userName : ""}</div>
              <div className="h-10 w-10 bg-white rounded-full text-black font-bold text-2xl flex items-center justify-center">
                {userName ? userName[0].toUpperCase() : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-1 text-black bg-white overflow-hidden">
            <div className="flex flex-col w-[320px] border-r overflow-y-auto px-5">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handlePoke( user )}
                    className="flex flex-row p-3 justify-center items-center mt-[-1px] border-t gap-3 hover:bg-gray"
                  >
                    <div className="h-9 w-9 px-3 bg-darkNavyBlue rounded-full text-white font-semibold text-xl flex items-center justify-center">
                      {user.userName ? user.userName[0].toUpperCase() : ""}
                    </div>
                    <div className="w-full text-lg font-semibold">
                      {user.userName ? user.userName : ""}
                    </div>
                  </button>
                ))}
            </div>

            <div className="flex flex-col w-[960px] px-4">
              <div className="flex flex-col flex-1 overflow-y-auto my-4">
                {/* Chat starts */}
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={
                      message.userName !== userName
                        ? "flex justify-start mb-4"
                        : "flex justify-end mb-4"
                    }
                  >
                    <div
                      className={
                        message.userName !== userName
                          ? "ml-2 flex flex-col"
                          : "mr-2 flex flex-col"
                      }
                    >
                      <div
                        className={
                          message.userName !== userName
                            ? "py-3 px-4 bg-gray w-full flex rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black"
                            : "py-3 px-4 bg-blue w-full flex rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                        }
                      >
                        {message.content}
                      </div>
                      <div className=" flex w-full mt-1">
                        <span
                          className={
                            message.userName !== userName
                              ? "font-semibold whitespace-nowrap mr-2 text-sm "
                              : "font-semibold text-sm"
                          }
                        >
                          {message.userName === userName
                            ? ""
                            : message.userName}
                        </span>
                        <span
                          className={
                            message.userName !== userName
                              ? "text-gray-500 flex w-full text-sm justify-start"
                              : "text-gray-500 flex w-full text-sm justify-end"
                          }
                        >
                          {formatTimestamp(message.sentAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Chat ends */}
              </div>

              <div className="border-t py-2">
                <form
                  className="flex"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <label htmlFor="chat" className="sr-only">
                    Your message
                  </label>
                  <div className="flex items-center gap-4 flex-1">
                    <textarea
                      id="chat"
                      rows="1"
                      className="flex-1 p-2.5 text-sm text-black bg-white rounded-lg border border-gray focus:ring-blue focus:border-blue resize-none"
                      placeholder="Your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress} // Add onKeyPress event handler
                    ></textarea>
                    <button
                      type="submit"
                      className={`p-2 text-blue rounded-full cursor-pointer hover:bg-blue-300 dark:text-blue dark:hover:bg-gray ${
                        messageInput.trim() === ""
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={messageInput.trim() === ""}
                    >
                      <svg
                        className="w-6 h-6 rotate-90"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
