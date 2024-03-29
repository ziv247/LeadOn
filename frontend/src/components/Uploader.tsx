/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Uploader = (props: { isVideo: any; onUplodCallBack: any }) => {
  const { isVideo, onUplodCallBack } = props;
  return !isVideo ? (
    <ImageUploader callback={onUplodCallBack} />
  ) : (
    <VideoUploader callback={onUplodCallBack} />
  );
};

//________________ImageUploader__________________________________________
const ImageUploader = (props: { callback: any }) => {
  const { callback } = props;
  const [selectedFile, setSelectedFile] = useState();
  // const [preview, setPreview] = useState("");
  const [filesList, setFilesList] = useState([]);
  const fileInput = useRef<HTMLInputElement>(null);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      // setPreview("");
      return;
    }
    const func = async () => {
      // const objectUrl = await convertToBase64(selectedFile);
      const newArr = [...filesList, ...selectedFile];
      if (newArr.length > 5) {
        newArr.length = 5;
      }

      setFilesList(newArr);
      callback(newArr);
    };
    func();
    // const objectUrl = URL.createObjectURL(selectedFile);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e.target.files.length + filesList.length >= 5) {
      toast.error("5 images only");
    }

    setSelectedFile(e.target.files);
  };

  const addImgClickedHandler = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  function removeImgHandler(idx: number): void {
    setFilesList((prev) => {
      const newArr = [...prev];
      newArr.splice(idx, 1);
      return newArr;
    });
  }

  return (
    <div className="d-flex mb-3 flex-wrap">
      <input
        type="file"
        onChange={onSelectFile}
        ref={fileInput}
        style={{ opacity: 0, display: "none" }}
        required
        accept="image/*"
        multiple
      />
      {filesList.map((item, index) => (
        <div key={index} className="position-relative img-place-holder">
          <img className="img-uploader" src={URL.createObjectURL(item)} />

          <div
            className="trash-container"
            onClick={() => removeImgHandler(index)}
          >
            <i className="fas fa-trash"></i>
          </div>
        </div>
      ))}
      {filesList.length < 5 && (
        <div
          className="img-uploader add-img-card"
          onClick={addImgClickedHandler}
        >
          +
        </div>
      )}
    </div>
  );
};

//________________VideoUploader__________________________________________
const VideoUploader = (props: { callback: any }) => {
  const { callback } = props;
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    setPreview(URL.createObjectURL(selectedFile));
    callback([selectedFile]);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  const addImgClickedHandler = () => {
    fileInput.current?.click();
  };

  return (
    <div className="d-flex mb-3">
      <input
        accept={"video/*"}
        type="file"
        onChange={onSelectFile}
        ref={fileInput}
        style={{ opacity: 0, display: "none" }}
        required
      />

      {preview ? (
        <video className="vid-uploader" src={preview} controls width={100} />
      ) : (
        <div
          className="vid-uploader add-img-card"
          onClick={addImgClickedHandler}
        >
          +
        </div>
      )}
    </div>
  );
};

// const convertToBase64 = (file: Blob) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// };
export default Uploader;
