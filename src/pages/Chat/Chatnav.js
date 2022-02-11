import React, { useState } from "react";
import "./Chatnav.css";
import {
  ChevronLeftIcon,
  ChatIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";

import SidebarChat from "./SidebarChat";

function Chatnav() {
  const [show, setShow] = useState(false);
  const [ChatShow, setChatShow] = useState(false);
  const handleOpen = () => {
    setShow(!show); // Toggle accordion
  };

  const Chathandler = () => {
    setChatShow(!ChatShow);
  };
  return (
    <div className="Chatnav">
      <div className="sidebar__inputs">
        <div className="back_btn" onClick={console.log("Hi")}>
          <ChevronLeftIcon className="logo" />
        </div>
        <input placeholder="Search" />
      </div>
      <div className="profie__info">
        <img
          src="https://lh3.googleusercontent.com/9WkSu8CP7gZjaEmUy8cpaKG3mK6ScHeEDvQf8driDoRxuxy4GPAs_W_Dn_DQascQSGDkdUL4cjmsnRrL6xN-NDp-s_RNwN5pxiCo"
          alt=""
        />
        <div className="chat_header">
          <h2>Jimmy Carter</h2>
          <div class="chat">
            <ChatIcon className="chat_status" />
            <p>Active on chat</p>
          </div>
        </div>
        <ChevronRightIcon className="profile" />
      </div>
      {/* Channels accordian */}
      <div className="Channels__accordian">
        <div className="accordian-header" onClick={handleOpen}>
          <div className="sign">
            {show ? (
              <ChevronDownIcon className="accordianicons" />
            ) : (
              <ChevronRightIcon className="accordianicons" />
            )}
          </div>
          <h3>CHANNELS</h3>
        </div>
        {show && (
          <div className="accordian-body">
            <div className="channel__items"># ⛅General</div>
            <div className="channel__items"># 🤚Product Design</div>
            <div className="channel__items"># 🤚Product Design</div>
            <div className="addChannels">
              <PlusCircleIcon className="addIcon" />
              <div className="">Add Channel</div>
            </div>
          </div>
        )}
      </div>
      {/* Chats accordian  */}
      <div className="Chats__accordian">
        <div className="accordianChat-header" onClick={Chathandler}>
          <div className="sign">
            {ChatShow ? (
              <ChevronDownIcon className="accordianicons" />
            ) : (
              <ChevronRightIcon className="accordianicons" />
            )}
          </div>
          <h3>CHATS</h3>
        </div>
        {ChatShow && (
          <div className="accordianChat-body">
            <SidebarChat />
            <SidebarChat />
            <SidebarChat />
            <div className="addChats">
              <PlusCircleIcon className="addIcon" />
              <div className="">Add Chat </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatnav;
