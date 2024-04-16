import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {

  const navigate = useNavigate();
  const handleRoomClick = () => {
    navigate("/room");
  };
  const handleLogoutClick = () => {
    navigate("/");
  };

  return (
    <div className="flex mx-40 py-4 px-3 justify-between items-center h-24 w-[1240px]">
      <div className="w-80 h-20 flex flex-row items-center  gap-2">
        <img
          src={
            "https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/ChatterHubLogo.png?alt=media&token=148ddfeb-df49-4539-9d3a-87f31fd996db"
          }
          alt="logo"
          className="h-20 "
        />
        <div className="text-2xl font-bold">Chatter Hub</div>
      </div>
      <ul className="flex text-lg font-bold hover:cursor-pointer">
        <li
          className={
            "p-4 hover:scale-125 ease-in-out duration-150"
          }
          onClick={handleRoomClick}
        >
          Room
        </li>
        <li
          className={
            "p-4 hover:scale-125 ease-in-out duration-150"
          }
          onClick={handleLogoutClick}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
