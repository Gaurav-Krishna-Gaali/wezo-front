import React from "react";
import "./Message.css";

function Message() {
  return (
    <div className="message">
      <img
        className="message__photo"
        src="https://lh3.googleusercontent.com/GGNZrZNkz5NNiUOUk-_7iRWT3TPPV2W6zDu0n57zZNZiGNBLEd84n3pYs3fGfV9QEhcge1rtTd0lp1nM7Mv2ntJ3g8OisoGAczXf=w1400-k"
        alt=""
      />
      <p>
        , velit necessitatibus, corporis vero laboriosam ab molestias, provident
        qui sapiente omnis maiores repellendus? Nemo nulla quis tenetur ipsa,
        laudantium maiores neque deserunt molestiae quae ut perspiciatis odit
        beatae inventore in enim?
      </p>
      <small>12:00pm</small>
    </div>
  );
}

export default Message;
