import React from "react";
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="w-screen h-screen">
      <div className="flex justify-start items-center px-[50px] ">
        <div className="w-[150px] p-4">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/ChatterHubLogo.png?alt=media&token=148ddfeb-df49-4539-9d3a-87f31fd996db"
            }
            alt="Chatter Hub Logo"
          />
        </div>
        <div>
          <p className="text-5xl font-bold">Chatter Hub</p>
        </div>
      </div>

      <div className="flex justify-between pl-[85px]">
        <div className="w-full mx-auto text-center flex-1 flex flex-col justify-center items-start pt-12">
          <p className="text-xl text-start font-bold">
            Connect with anyone, anywhere. Chat effortlessly with Chatter Hub
          </p>
          <h1 className="text-start text-4xl font-bold py-6">
            Chat seemlessly with unlimited members.
          </h1>
          <div className="flex justify-center items-center">
            <p className="text-start text-3xl font-bold py-4 ">
              A Unified Platform for
              <ReactTyped
                className="md:text-3xl sm:text-4xl text-xl font-bold md:pl-2 pl-2"
                strings={["Friends", "Families", "Loved ones"]}
                typeSpeed={100}
                backSpeed={120}
                loop
              />
            </p>
          </div>
          <p className="text-start  text-xl font-bold text-white py-5">
            Start chatting today! Sign up for free and create your first group
          </p>
          <button
            className="bg-white rounded-md my-6 py-3 px-8 text-black font-semibold text-xl hover:cursor-pointer hover:bg-gray"
            onClick={() => handleClick()}
          >
            Get Started
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/LandingChatting.png?alt=media&token=3bec2479-0126-44d2-ac1c-6be91bd8ade7"
            }
            className="w-[450px] h-[450px] object-cover"
            alt="Girl Chatting"
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
