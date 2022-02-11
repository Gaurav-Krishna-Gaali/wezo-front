import React from "react";
import "./SidebarRight.css";

function SidebarRight() {
  return (
    <div className="sidebar">
      <div className="header">
        <h3 className="righth3">Biography</h3>
        <p className="rightp">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quidem
          sit, atque vitae quos earum doloribus fuga nihil voluptate facere.
        </p>
      </div>

      <div className="media">
        <h3 className="righth3">Media</h3>
        <div className="photo">
          <img
            src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDIvYWFkMTlmNjItMzgxMy00OTQzLThhNWMtZDIxMTc5NTkwZjQwLmpwZw==.jpg"
            alt=""
          />
          <img
            src="https://investorplace.com/wp-content/uploads/2021/03/nft-neon-sign.jpg"
            alt=""
          />
          <img
            src="https://th.bing.com/th/id/OIP.dWkWiuwAgCL9mqxdsM3raAHaE7?pid=ImgDet&rs=1"
            alt=""
          />
          <img
            src="https://news.artnet.com/app/news-upload/2021/09/Yuga-Labs-Bored-Ape-Yacht-Club-4466.jpg"
            alt=""
          />
        </div>
      </div>

      <div className="links">
        <h3 className="righth3">Links</h3>
        <a href="/chats">python</a>
        <a href="/chats">javascript</a>
        <a href="/chats">rust</a>
        <a href="/chats">solana</a>
      </div>
    </div>
  );
}

export default SidebarRight;
