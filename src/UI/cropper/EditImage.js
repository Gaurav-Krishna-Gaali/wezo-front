import { useState, useRef } from "react";

import ImageCropDialog from "./ImageCropDialog";

const EditPic = (props) => {
  const profile = props.default;

  const inputFile = useRef();
  const [display, setDisplay] = useState(profile.imageURL);
  const [data, setData] = useState({
    selectedImageURL: null,
    crop: null,
    aspect: null,
    zoom: null,
    rotation: 0,
    croppedImageURL: null,
    fileType: null,
  });
  const [click, setClick] = useState(false);

  const onImageSelected = (e) => {
    // console.log("fileeee", e.target.files);
    // console.log("selected image --> ", typeof inputFile.current.files);

    if (e.target.files[0]) {
      // console.log("shit happens-->", e.target.files[0]);

      ///////////////////////////////////

      //////////////////////////////////
      setData({
        selectedImageURL: URL.createObjectURL(e.target.files[0]),
        crop: null,
        aspect: null,
        zoom: null,
        rotation: 0,
        croppedImageURL: null,
        fileType: e.target.files[0].name.split(".").slice(-1),
      });

      setClick(true);
    }
  };

  const setCroppedImageFor = (
    id,
    crop,
    zoom,
    aspect,
    rotation,
    croppedImageURL
  ) => {
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
    inputFile.current.files = null;
    console.log(inputFile.current.files);
    setClick(false);
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.value = null;
    inputFile.current.click();
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
        onClick={
          data.croppedImageURL !== null
            ? () => {
                setClick(true);
              }
            : onButtonClick
        }
      />
      <input
        type="file"
        accept="image/*"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={onImageSelected}
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

export default EditPic;
