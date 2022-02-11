import React from "react";
import ChatBox from "./ChatBox";
import Chatnav from "./Chatnav";
import "./Chats.css";
import SidebarRight from "./SidebarRight";

function Chats() {
  return (
    <div className="Chats">
      {/* Sidebar  */}
      <Chatnav />
      {/* chat  */}
      <ChatBox />
      <SidebarRight />
    </div>
  );
}

export default Chats;
