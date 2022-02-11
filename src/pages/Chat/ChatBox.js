import React from "react";
import "./ChatBox.css";
// import Chat_input from "./Chat_input";
import Message from "./Message";
import { UploadIcon } from "@heroicons/react/solid";
import Message_sender from "./Message_sender";

function ChatBox() {
  return (
    <div className="Chatbox">
      <div className="chat__header">
        <img
          //   src="https://lh3.googleusercontent.com/9WkSu8CP7gZjaEmUy8cpaKG3mK6ScHeEDvQf8driDoRxuxy4GPAs_W_Dn_DQascQSGDkdUL4cjmsnRrL6xN-NDp-s_RNwN5pxiCo"
          src="https://th.bing.com/th/id/OIP.iv2-uXBj25t8Stl9c0kCiQHaHa?pid=ImgDet&rs=1"
          alt=""
          className="profile__image"
        />
        <h4>
          <span className="chat__name">Henry Ford</span>
        </h4>
        {/* <strong>Details</strong> */}
      </div>

      {/* chat messagea  */}

      <div className="chat__messages">
        {/* <FlipMove>
          {messages.map(({ id, data }) => (
            <Message key={id} contents={data} />
          ))}
        </FlipMove> */}
        <Message />
        {/* <Message /> */}
        <Message_sender />
        {/* <Message />
        <Message /> */}
      </div>
      {/* <Chat_input /> */}
      <div className="chat__input">
        <form>
          <input
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            placeholder="Type in your message"
            type="text"
          >
            {/* <UploadIcon /> */}
          </input>
          <button
          //   onClick={sendMessage}
          >
            Send Messages
          </button>
        </form>
        <div className="chatbox__icons">
          <UploadIcon className="icons" />
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
