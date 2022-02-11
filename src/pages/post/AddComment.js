import Card from "../../UI/Card";
import cardClass from "./post.module.css";
import classes from "./addComment.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { autosize } from "../signUP/afterSignUp/Bio";
import addImage from "../../UI/imgs/add image.svg";
import addGif from "../../UI/imgs/add gif.svg";
import addVideo from "../../UI/imgs/add video.svg";
import Button from "../../UI/Button";
import CropIt from "../../UI/cropper/CropIt";
import garbage from "../../UI/imgs/delete.svg";
import pencil from "../../UI/imgs/pencil.svg";
import ImageCropDialog from "../../UI/cropper/ImageCropDialog";
import Gif from "../../UI/gifPicker/Gif";
import {
  addCommentURL,
  commentStatusURL,
  addReplyURL,
  replyStatusURL,
  createPostURL,
  postStatusURL,
  startUploadURL,
  getUploadURL,
  finishUploadURL,
} from "../../URL/signUpURL";
import axios from "axios";
import { srcToFile } from "../signUP/afterSignUp/UploadProfile";
import { detailedPostActions } from "../../Store/detailed-post-slice";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postActions } from "../../Store/posts-slice";
import closeIcon from "../../UI/imgs/close.svg";
import P from "../../UI/P";
import arrowIcon from "../../UI/imgs/arrow.svg";

var FormData = require("form-data");
var fs = require("fs");

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

async function getFileFromUrl(url, name, defaultType = "image/jpeg") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: defaultType,
  });
}

//

//

const AddComment = (props) => {
  const textArea = useRef();
  const [text, setText] = useState("");
  const [image, setImage] = useState([]);
  const [showGif, setShowGif] = useState(false);
  const loggedUser = props.loggedUser;
  const inputFile = useRef();
  const [gif, setGif] = useState();
  const toastId = useRef(null);
  const dispatch = useDispatch();
  const inputVideo = useRef(null);
  const [f, setF] = useState({
    selectedFile: null,
    uploadId: "",
    fileName: "",
  });
  const [progress, setProgress] = useState({ 1: 0 });

  // collab type post
  const [postType, setPostType] = useState("Normal");

  // const usedForReply = props.usedAs === "addReply" ? true : false;

  //---------------------------------------------

  const [click, setClick] = useState(0);
  const [data, setData] = useState({
    selectedImageURL: null,
    zoom: null,
    crop: null,
    rotation: null,
    type: null,
  });
  // const [video, setVideo] = useState(false);

  const onCancel = () => {
    setClick(0);
  };

  const resetImage = () => {
    setImage((p) => {
      p.splice(click - 1, 1);
      return p;
    });

    setClick(0);
  };

  const clickHandler = (e, i) => {
    setClick(i + 1);
    setData((p) => ({ ...p, selectedImageURL: image[i].imageURL }));
  };

  const onImageSelected = (e) => {
    if (f.selectedFile) {
      setF({
        selectedFile: null,
        uploadId: "",
        fileName: "",
      });
    }

    if (e.target.files[0]) {
      setGif();

      for (let x = 0; x < Math.min(e.target.files.length, 4); x++) {
        setImage((p) => {
          if (p.length >= 4) {
            return p;
          }

          return [
            ...p,
            {
              imageURL: URL.createObjectURL(e.target.files[x]),
              zoom: null,
              crop: null,
              rotation: null,
              aspect: 1,
              croppedImageURL: null,
              type: e.target.files[x].name.split(".").at(-1),
              rawURL: e.target.files[x],
            },
          ];
        });
      }
    }
  };

  const setCroppedImageFor = (id, crop, zoom, aspect, rotation, croppedImageURL) => {
    // console.log("the send pic hander", image);
    setImage((p) => {
      // let mod = p[click-1]
      // let added = {...mod, imageURL:croppedImageURL}
      p[click - 1].croppedImageURL = croppedImageURL;
      p[click - 1].crop = crop;
      p[click - 1].zoom = zoom;
      p[click - 1].rotation = rotation;
      p[click - 1].aspect = aspect;

      return p;
    });

    // console.log("affert croppping,  ", image);

    setClick(0);
  };

  //---------------------------------------------

  let profile;
  if (loggedUser && loggedUser.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + loggedUser.profile.replace("$", "%24");
  }
  if (loggedUser.profile === undefined) {
    profile = "/images/profile.png";
  }
  const typingHandler = (e) => {
    if (e.target.value.length <= (props.usedAs === "addPost" ? 1024 : 180)) {
      setText(e.target.value);
    }
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.value = null;
    inputFile.current.click();
  };

  const videoHandler = () => {
    // `current` points to the mounted file input element
    inputVideo.current.value = null;
    inputVideo.current.click();
  };

  const onGifClick = () => {
    if (f.selectedFile) {
      setF({
        selectedFile: null,
        uploadId: "",
        fileName: "",
      });
    }

    setShowGif((p) => !p);
  };

  const settingGif = (id) => {
    setGif(id);
    setShowGif(false);
    setImage([]);
  };

  const deleteGif = () => {
    setGif();
  };

  const notify = (message, details = null) => (toastId.current = toast(message, { autoClose: false, ...details }));

  const update = (message, autoClose = 1000, details = null) =>
    toast.update(toastId.current, {
      render: message,
      type: toast.TYPE.SUCCESS,
      autoClose: autoClose,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      ...details,
    });

  const startUpload = async () => {
    try {
      // update("Uploading video");
      // update("uploading video", 1000, { type: toast.TYPE.INFO });
      update("uploading video", 1000, { type: toast.TYPE.INFO });
      const resp = await axios.post(
        createPostURL,
        { hasVideo: true, imgs: [], vformat: f.fileName.split(".").at(-1), postContent: text },
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );

      setF((p) => {
        return { ...p, uploadId: resp.data.uploadId };
      });

      // console.log("here 1");
      // update("uploading video", false);

      // got url now start uploading
      const CHUNK_SIZE = 7000000;
      const fileSize = f.selectedFile.size;

      const NUM_CHUNKS = Math.floor(fileSize / CHUNK_SIZE);

      let promisesArray = [];
      let start, end, blob;

      // console.log("here 2");

      for (let index = 1; index < NUM_CHUNKS + 1; index++) {
        // console.log("here index ", index);
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob = index < NUM_CHUNKS ? f.selectedFile.slice(start, end) : f.selectedFile.slice(start);

        // (1) Generate presigned URL for each part
        let getUploadUrlResp = await axios.post(
          getUploadURL,
          { videoKey: resp.data.videoKey, partNumber: index, uploadId: resp.data.uploadId },
          {
            headers: {
              Authorization: "Bearer " + props.token,
            },
          }
        );

        let { presignedUrl } = getUploadUrlResp.data;
        // console.log("   Presigned URL " + index + ": " + presignedUrl + " filetype " + f.selectedFile.type);

        // (2) Puts each file part into the storage server
        // TODO: this will be a great interview question
        // how do you implement a progress bar with multipart upload
        let uploadResp = axios.put(presignedUrl, blob, {
          headers: { "Content-Type": "video/" + f.fileName.split(".").at(-1) },
          onUploadProgress: (pEvent) => {
            let per = Math.round((pEvent.loaded * 100) / pEvent.total);
            let obj = {};
            obj[index] = per;
            setProgress((p) => ({ ...p, ...obj }));
            // console.log("the progress of --> " + index + " is " + progress[index]);
          },
        });
        // console.log('   Upload no ' + index + '; Etag: ' + uploadResp.headers.etag)
        promisesArray.push(uploadResp);
      }

      // console.log("here 4");

      let resolvedArray = await Promise.all(promisesArray);
      notify("video uploaded", { type: toast.TYPE.SUCCESS, autoClose: 500 });
      // console.log(resolvedArray, " resolvedAr");

      let uploadPartsArray = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag.substring(1, resolvedPromise.headers.etag.length - 1),
          PartNumber: index + 1,
        });
      });

      const body = {
        params: {
          parts: [...uploadPartsArray],
          uploadId: resp.data.uploadId,
        },
        videoKey: resp.data.videoKey,
      };

      // console.log("here 5");
      let completeUploadResp = await axios.post(finishUploadURL, body, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });
      // notify("Post will be live soon");

      setF({
        selectedFile: null,
        uploadId: "",
        fileName: "",
      });

      setProgress({ 1: 0 });

      // console.log(completeUploadResp.data, " Stuff");
    } catch (err) {
      // console.error(err);
    }
  };

  const postComment = async (e, setClick) => {
    try {
      if (props.usedAs === "addReply") {
        notify("Adding Reply");
      } else if (props.usedAs === "addComment") {
        notify("Adding Comment");
      } else if (props.usedAs === "addPost") {
        notify("Adding post");
      }

      if (f.selectedFile && props.usedAs === "addPost") {
        startUpload();
        return;
      }

      const imageInfo = image.map((e) => {
        return e.type;
      });

      let body;

      if (props.usedAs === "addReply") {
        body = {
          postID: props.postID,
          commentID: props.commentID,
          reply: text,
          gif: gif ? gif.id : null,
          imgs: imageInfo,
        };
      } else if (props.usedAs === "addComment") {
        body = { postID: props.postID, comment: text, gif: gif ? gif.id : null, imgs: imageInfo };
      } else if (props.usedAs === "addPost") {
        body = { postContent: text, gif: gif ? gif.id : null, imgs: imageInfo, postType: postType };
      }

      const userDetails = {
        name: loggedUser.name,
        userID: loggedUser.userID,
        profile: loggedUser.profile,
        _id: loggedUser._id,
      };

      const whichURL =
        props.usedAs === "addReply" ? addReplyURL : props.usedAs === "addComment" ? addCommentURL : createPostURL;

      const result = await axios.post(whichURL, body, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });

      if (result.data.preUrls.length === 0) {
        if (props.usedAs === "addReply") {
          update("Reply added");
        } else if (props.usedAs === "addComment") {
          update("Comment added");
        } else if (props.usedAs === "addPost") {
          update("Post added");
        }

        // this is for adding reply or comment in real time with offline data
        if (props.usedAs === "addReply") {
          dispatch(
            detailedPostActions.addRepliesToTop({
              id: props.index,
              replies: [
                {
                  ...result.data.reply,
                  u_id: userDetails,
                  likes: [{ count: 0 }],
                  dislikes: [{ count: 0 }],
                },
              ],
            })
          );
        } else if (props.usedAs === "addComment") {
          // dispatch(postActions.incrementComment({ id: props.postID }));

          dispatch(
            detailedPostActions.addItOnTop({
              comments: [
                {
                  ...result.data.comment,
                  u_id: userDetails,
                  likes: [{ count: 0 }],
                  dislikes: [{ count: 0 }],
                  repliesCnt: [{ count: 0 }],
                },
              ],
            })
          );
        } else if (props.usedAs === "addPost") {
          dispatch(
            postActions.addPostToTop({
              post: { ...result.data.post, u_id: userDetails, likes: [{ count: 0 }], dislikes: [{ count: 0 }] },
            })
          );
        }
        setImage([]);
        setGif();
        setText("");

        return;
      }

      const preUrls = result.data.preUrls;

      for (let x = 0; x < preUrls.length; x++) {
        // console.log(preUrls[x]);
        const fields = preUrls[x].fields;
        let file;
        if (image[x].croppedImageURL === null) {
          file = await toBase64(image[x].rawURL);
          file = await srcToFile(file, "profile." + imageInfo[x], "images/" + imageInfo[x]);
        } else {
          file = await srcToFile(image[x].croppedImageURL, "profile." + imageInfo[x], "images/" + imageInfo[x]);
        }

        var data = new FormData();
        data.append("key", fields.key);
        data.append("bucket", fields.bucket);
        data.append("X-Amz-Algorithm", fields["X-Amz-Algorithm"]);
        data.append("X-Amz-Credential", fields["X-Amz-Credential"]);
        data.append("X-Amz-Date", fields["X-Amz-Date"]);
        data.append("Policy", fields.Policy);
        data.append("X-Amz-Signature", fields["X-Amz-Signature"]);
        data.append("file", file);

        var config = {
          method: "post",
          url: preUrls[x].url,
          headers: {
            ...data,
          },
          data: data,
        };

        const sent = await axios(config);
      }

      // console.log("result.data.id", result);
      const statusURL =
        props.usedAs === "addReply"
          ? replyStatusURL + result.data.id
          : props.usedAs === "addPost"
          ? postStatusURL + result.data.id
          : commentStatusURL + result.data.id;

      const result2 = await axios.get(statusURL, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });

      setImage([]);
      setGif();
      setText("");
      if (props.usedAs === "addReply") {
        dispatch(
          detailedPostActions.addRepliesToTop({
            id: props.index,
            replies: [
              {
                ...result2.data.reply,
                u_id: userDetails,
              },
            ],
          })
        );
        update("Reply added");
      } else if (props.usedAs === "addComment") {
        dispatch(postActions.incrementComment({ id: props.postID }));
        dispatch(
          detailedPostActions.addItOnTop({
            comments: [
              {
                ...result2.data.comment,
                u_id: userDetails,
              },
            ],
          })
        );
        update("Comment added");
      } else if (props.usedAs === "addPost") {
        dispatch(postActions.addPostToTop({ post: { ...result2.data.post, u_id: userDetails } }));
        update("Post added");
      }

      // console.log("-- post comment result --", result);
    } catch (err) {
      // console.log("err in adding comments", err);
      toast.update(toastId.current, {
        render: "Err adding comment",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
        style: { border: "none", color: "#f91880" },
      });
    }
  };

  const onVideoSelected = (e) => {
    try {
      if (image.length > 0) {
        setImage([]);
      }
      if (gif) {
        setGif();
      }

      let selectedFile = e.target.files[0];
      let fileName = selectedFile.name;
      setF({
        selectedFile: selectedFile,
        fileName: fileName,
        fileURL: URL.createObjectURL(selectedFile),
      });
    } catch (err) {
      // console.error(err);
    }
  };

  const removeVideo = () => {
    if (f.selectedFile) {
      setF({
        selectedFile: null,
        uploadId: "",
        fileName: "",
      });
    }
  };

  // console.table(progress);
  function sum(obj) {
    if (!obj || obj === undefined || obj === {}) {
      return 0;
    }

    var sum = 0;
    var num = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el)) {
        sum += parseFloat(obj[el]);
        num = num + 1;
      }
    }
    return sum / num;
  }
  // console.log(progress.length);
  // console.log("eweewewe , ", sum(progress));

  // TODO: collab dropdown section

  const dropdownHandler = (e) => {
    setPostType((p) => {
      if (p === "Normal") {
        return "Collab";
      } else {
        return "Normal";
      }
    });
  };

  return (
    <Fragment>
      <Card
        custom={`${cardClass.card} ${classes.card}  ${props.usedAs === "addReply" ? classes.cardForReply : ""} ${
          props.usedAs === "addPost" ? classes.cardForPost : ""
        }`}
      >
        {/* <img className={classes.profile} src={profile} alt={"profile of " + loggedUser.name} /> */}
        <div className={classes.content}>
          <textarea
            rows={props.usedAs === "addReply" ? "2" : "4"}
            cols="4"
            ref={textArea}
            className={`${classes.comment}`}
            onChange={typingHandler}
            onKeyDown={autosize}
            placeholder={
              props.usedAs === "addReply"
                ? "add your reply..."
                : props.usedAs === "addComment"
                ? "comment your thoughts..."
                : "start your post here..."
            }
            value={text}
          ></textarea>
          <p className={classes.count}>{props.usedAs === "addPost" ? 1024 - text.length : 180 - text.length}</p>
        </div>
        {image.length > 0 ? (
          <div className={classes.selectedContent}>
            {image.map((e, i) => {
              // console.log("element ,", e);

              if (i >= 4) {
                return;
              }

              return (
                <div key={i} className={classes.parentDivClass}>
                  <img
                    className={classes.selImage}
                    key={"a" + i}
                    src={e.croppedImageURL ? e.croppedImageURL : e.imageURL}
                    alt=""
                  />
                  <div className={classes.edit}>
                    <img
                      onClick={(ev) => {
                        clickHandler(ev, i);
                      }}
                      key={"b" + i}
                      src={pencil}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : gif ? (
          <div className={classes.selectedContent}>
            <div className={classes.parentDivClass}>
              <img className={classes.selImage} src={gif.url} alt="" />
              <div className={classes.edit}>
                <img src={garbage} alt="" onClick={deleteGif} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {f.selectedFile ? (
          <div className={classes.videoContainer}>
            <img onClick={removeVideo} src={closeIcon} alt="" />

            <video type="video/mp4" controls={true} src={f.fileURL}></video>
            {/* <VideoJS type="local" source={URL.createObjectURL(f.selectedFile)} /> */}
            <div style={{ width: sum(progress) + "%" }} className={classes.progressBar}></div>
          </div>
        ) : (
          ""
        )}
        <div className={classes.bottom}>
          <img className={classes.addButtons} src={addImage} onClick={onButtonClick} alt="" />
          <img className={classes.addButtons} src={addGif} alt="" onClick={onGifClick} />
          {props.usedAs === "addPost" ? (
            <img className={classes.addButtons} src={addVideo} alt="" onClick={videoHandler} />
          ) : (
            ""
          )}
          {props.usedAs === "addPost" ? (
            <div onClick={dropdownHandler} className={classes.dropdown}>
              {postType} <span> &#x25BC;</span>
            </div>
          ) : (
            ""
          )}
          <Button onClick={postComment} name="post" custom={classes.button} />
        </div>

        {click !== 0 ? (
          <ImageCropDialog
            id={1}
            imageURL={image[click - 1].imageURL}
            cropInit={image[click - 1].crop}
            zoomInit={image[click - 1].zoom}
            aspectInit={image[click - 1].aspect}
            onCancel={onCancel}
            rotationInit={image[click - 1].rotation}
            setCroppedImageFor={setCroppedImageFor}
            resetImage={resetImage}
            ratios={[1, 16 / 9]}
          />
        ) : null}

        <input
          type="file"
          accept="image/*"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={onImageSelected}
          multiple
        />
        {props.usedAs === "addPost" ? (
          <input
            type="file"
            accept="video/*"
            id="file"
            ref={inputVideo}
            style={{ display: "none" }}
            onChange={onVideoSelected}
            multiple
          />
        ) : (
          ""
        )}
      </Card>
      {showGif ? <Gif setGif={settingGif} setShowGif={setShowGif} /> : ""}
    </Fragment>
  );
};

export default AddComment;
