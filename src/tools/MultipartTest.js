import axios from "axios";
import { useState } from "react";
import { startUploadURL, getUploadURL, finishUploadURL } from "../URL/signUpURL";

const MultipartTest = (props) => {
  const [f, setF] = useState({
    selectedFile: null,
    uploadId: "",
    fileName: "",
  });

  const fileSelectedHandler = (e) => {
    try {
      let selectedFile = e.target.files[0];
      let fileName = selectedFile.name;
      setF({
        selectedFile: selectedFile,
        fileName: fileName,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const startUpload = async (url, token) => {
    try {
      const resp = await axios.get(startUploadURL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setF((p) => {
        return { ...p, uploadId: resp.data.uploadId };
      });

      console.log("here 1");

      // got url now start uploading
      const CHUNK_SIZE = 10000000;
      const fileSize = f.selectedFile.size;

      const NUM_CHUNKS = Math.floor(fileSize / CHUNK_SIZE);

      let promisesArray = [];
      let start, end, blob;

      console.log("here 2");

      for (let index = 1; index < NUM_CHUNKS + 1; index++) {
        console.log("here index ", index);
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob = index < NUM_CHUNKS ? f.selectedFile.slice(start, end) : f.selectedFile.slice(start);

        // (1) Generate presigned URL for each part
        let getUploadUrlResp = await axios.get(getUploadURL + index + "/" + resp.data.uploadId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        let { presignedUrl } = getUploadUrlResp.data;
        console.log("   Presigned URL " + index + ": " + presignedUrl + " filetype " + f.selectedFile.type);

        // (2) Puts each file part into the storage server
        let uploadResp = axios.put(presignedUrl, blob, { headers: { "Content-Type": "video/mp4" } });
        // console.log('   Upload no ' + index + '; Etag: ' + uploadResp.headers.etag)
        promisesArray.push(uploadResp);
      }

      console.log("here 4");

      let resolvedArray = await Promise.all(promisesArray);
      console.log(resolvedArray, " resolvedAr");

      let uploadPartsArray = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });

      const body = {
        params: {
          parts: [...uploadPartsArray],
          uploadId: f.uploadId,
        },
      };

      console.log("here 5");
      let completeUploadResp = await axios.post(
        finishUploadURL,
        {
          params: {
            fileName: f.fileName,
            parts: uploadPartsArray,
            uploadId: f.uploadId,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log(completeUploadResp.data, " Stuff");
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = () => {
    try {
      startUpload(startUpload, props.token, f, setF);
    } catch (err) {}
  };

  return (
    <div>
      <div>
        <p>Upload Dataset:</p>
        <input type="file" id="file" onChange={fileSelectedHandler} />
        <button type="submit" onClick={uploadFile}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default MultipartTest;
