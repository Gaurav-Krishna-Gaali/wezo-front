import React from "react";
import { UploadIcon } from "@heroicons/react/solid";

function Chat_input() {
  return (
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
  );
}

export default Chat_input;
