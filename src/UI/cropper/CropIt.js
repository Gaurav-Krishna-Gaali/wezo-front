import { useState, useRef } from "react";

import ImageCropDialog from "./ImageCropDialog";

const CropIt = (props) => {
  const profile = props.default;

  const inputFile = useRef();
  const [display, setDisplay] = useState(profile.imageURL);
  const [data, setData] = useState({
    selectedImageURL: props.default.imageURL,
    crop: null,
    aspect: null,
    zoom: null,
    rotation: 0,
    croppedImageURL: null,
    fileType: null,
  });
  const [click, setClick] = useState(false);

  const setCroppedImageFor = (id, crop, zoom, aspect, rotation, croppedImageURL) => {
    setData((prev) => ({
      ...prev,
      crop,
      zoom,
      aspect,
      rotation,
      croppedImageURL,
    }));
    setClick(false);

    // console.log("---> type of file selevctyeds", data);

    setDisplay(croppedImageURL);
    // const img = new File([croppedImageURL], "nameOfFile", {
    //   type: "image/" + data.fileType,
    // });

    // const img = new File([croppedImageURL], "nameOfFile", {
    //   type: "jpeg",
    // });

    props.sendPic({
      type: "image/" + data.fileType,
      img: croppedImageURL,
    });

    // console.log("file of cropped image ", croppedImageURL);
  };

  const onCancel = () => {
    // inputFile.current.files = null;
    // console.log(inputFile.current.files);
    setClick(false);
  };

  const resetImage = () => {
    setData({
      selectedImageURL: null,
      crop: null,
      aspect: null,
      zoom: null,
      croppedImageURL: null,
    });

    setDisplay(profile.imageURL);
    setClick(false);
  };

  return (
    <div className={props.parentDivClass ? props.parentDivClass : ""}>
      <img
        src={display}
        alt="profile"
        className={props.className}
        onClick={() => {
          setClick(true);
        }}
      />

      {click ? (
        <ImageCropDialog
          id={1}
          imageURL={data.selectedImageURL}
          cropInit={data.crop}
          zoomInit={data.zoom}
          aspectInit={props.aspect}
          onCancel={onCancel}
          rotationInit={data.rotation}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
          sendPic={props.sendPic}
        />
      ) : null}
      {props.children}
    </div>
  );
};

export default CropIt;
