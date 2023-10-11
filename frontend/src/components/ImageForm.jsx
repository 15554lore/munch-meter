import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/esm/Container";
import "../styles/ImageForm.css";

// Text submit button, fetches /upload route to add text to database

export default function ImageForm({ userId }) {
  const [dragActive, setDragActive] = useState(false);
  const [img, setImg] = useState("");
  const [imgForm, setImgForm] = useState("");
  const inputRef = useRef(null);
  const [imageTitle, setImageTitle] = useState("");
  const [showImageBool, setShowImageBool] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type == "dragenter" || e.type == "dragover") {
      setDragActive(true);
    } else if (e.type == "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    const formData = imgForm;
    console.log(userId);
    formData.append("title", imageTitle);
    formData.append("userId", userId);
    console.log(formData);
    fetch("/api/image-upload", {
      method: "POST",
      headers: {
        Accepts: "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    setShowImageBool(false);
    setImageTitle("");
  };

  const handleReturnbutton = (e) => {
    e.preventDefault();

    setShowImageBool(false);
  };

  const handleFiles = (files) => {
    setImg(URL.createObjectURL(files[0]));
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    setImgForm(formData);
    setShowImageBool(true);
    // fetch("/api/image-upload", {
    //     method: 'POST',
    //     headers: {
    //       "Accepts":"multipart/form-data",
    //     },
    //     body: formData
    //   })
    // .then((response) => response.json())
    // .then((data) => console.log(data));
  };

  if (showImageBool == true) {
    return (
      <Container className="mx-auto text-center">
        <div style={{ alignItems: "center", justifyContent: "center" }}>
          <img src={img} style={{ width: 400, height: 400 }} />
          <form>
            <label className="m-3">
              Title your creation (32 char limit)!
              <input
                type="text"
                onChange={(e) => setImageTitle(e.target.value)}
                className="m-3"
              />
            </label>
          </form>
          <button onClick={handleSubmitButton} className="btn btn-light m-1">
            Submit Image
          </button>
          <button onClick={handleReturnbutton} className="btn btn-light m-1">
            Select New Image
          </button>
        </div>
      </Container>
    );
  } else {
    return (
      <div className="image-upload">
        <form
          id="image-upload-form"
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={inputRef}
            id="input-file-upload"
            accept="image/*"
            onChange={handleChange}
          />
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? "drag-active" : ""}
          >
            <div>
              <p>Drag and drop your file here</p>
              <button className="upload-button" onClick={onButtonClick}>
                Upload a file
              </button>
            </div>
          </label>
          {dragActive && (
            <div
              id="drag-file-element"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              htmlFor="label-file-upload"
            ></div>
          )}
        </form>
      </div>
    );
  }
}
