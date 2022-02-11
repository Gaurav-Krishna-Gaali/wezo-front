import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./player.css";
// those imports are important
import qualitySelector from "videojs-hls-quality-selector";
import qualityLevels from "videojs-contrib-quality-levels";

const VideoPlayer = ({ liveURL, source, type }) => {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    if (player) {
      player.src([liveURL]);
    }
  }, [liveURL]);

  useEffect(() => {
    const videoJsOptions = {
      controls: true,
      fluid: true,
      responsive: true,
      controlBar: {
        liveDisplay: true,
        pictureInPictureToggle: false,
      },

      sources: [
        {
          src: source,
        },
      ],
    };

    const p = videojs(videoRef.current, videoJsOptions, function onPlayerReaady() {
      // console.log('onPlayerReady');
    });
    setPlayer(p);

    return () => {
      if (player) player.dispose();
    };
  }, []);

  useEffect(() => {
    if (player) player.hlsQualitySelector({ displayCurrentQuality: true });
  }, [player]);
  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin vjs-big-play-centered"></video>
    </div>
  );
};

export default VideoPlayer;
