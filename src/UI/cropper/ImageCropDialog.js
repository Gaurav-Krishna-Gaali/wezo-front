import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import classes from "./ImageCropDialog.module.css";
import closeImg from "../imgs/close.svg";
import cropImg from "../imgs/crop.svg";
import deleteImg from "../imgs/delete.svg";
import aspectImg from "../imgs/aspect.svg";

const ImageCropDialog = ({
  id,
  imageURL,
  cropInit,
  zoomInit,
  rotationInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
  ratios,
}) => {
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit == null) {
    aspectInit = 1;
  }

  if (rotationInit === null) {
    rotationInit = 0;
  }

  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState(cropInit);
  const [aspect, setAspect] = useState(aspectInit);
  const [rotation, setRotation] = useState(rotationInit);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImageURL = await getCroppedImg(imageURL, croppedAreaPixels, rotation);

    setCroppedImageFor(id, crop, zoom, aspect, rotation, croppedImageURL);
  };

  const onRotationChange = (rot) => {
    setRotation(rot);
  };

  const toggleAspect = () => {
    setAspect((p) => {
      let ind = ratios.indexOf(p);

      if (ind + 1 >= ratios.length) {
        setAspect(ratios[0]);
      } else {
        setAspect(ratios[ind + 1]);
      }
    });
  };

  return (
    <div>
      <div className={classes["backdrop"]}></div>
      <div className={classes["crop-container"]}>
        <Cropper
          image={imageURL}
          zoom={zoom}
          crop={crop}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          maxZoom={10}
          aspect={aspect}
          rotation={rotation}
          onRotationChange={onRotationChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className={classes["controls"]}>
        <div className={classes["controls-upper-area"]}>
          <input
            type="range"
            min={0}
            max={360}
            step={2}
            value={rotation}
            id="rotate"
            onInput={(e) => onRotationChange(e.target.value)}
            className={classes["slider"]}
          />
          {/* <label htmlFor="rotate">Rotate</label> */}
          {/* <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            id="zoom"
            onInput={(e) => onZoomChange(e.target.value)}
            className={classes["slider"]}
          />
          <label htmlFor="zoom">Zoom</label> */}
        </div>
        <div className={classes["button-area"]}>
          <img src={closeImg} onClick={onCancel} alt="close cropper" />
          <img alt="crop" src={cropImg} onClick={onCrop} />
          {ratios ? <img src={aspectImg} alt="" onClick={toggleAspect} /> : ""}
          <img
            src={deleteImg}
            alt="delete"
            onClick={(e) => {
              resetImage(id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
