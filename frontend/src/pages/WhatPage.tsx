/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";
import Uploader from "../components/Uploader";

export default function WhatPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,

  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/what");
    }
  }, [userInfo, navigate]);

  const [what] = useState(
    localStorage.getItem("whatSection")
      ? JSON.parse(localStorage.getItem("whatSection")!)
      : {}
  );

  const [text, setText] = useState(what.text ? what.text : "");
  const [files, setFiles] = useState(what.files ? what.files : []);
  const [isVideo, setIsVideo] = useState(what.isVideo ? what.isVideo : false);

  const radioChangeHandler = (e: any) => {
    setIsVideo(e.target.id == "inline-radio-2");
  };

  const handleFileChange = (files: any) => {
    setFiles(files);
  };

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    localStorage.setItem(
      "whatSection",
      JSON.stringify({ text, files, isVideo })
    );
    dispatch({
      type: "SAVE_FILES",
      payload: files,
    });

    navigate("/where");
  };

  return (
    <div>
      <Helmet>
        <title>לידאון - מה לפרסם</title>
      </Helmet>

      <CheckoutSteps step1></CheckoutSteps>

      <div className="container small-container">
        <h1 className="my-3">מה לפרסם</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>מלל לפוסט</Form.Label>
            <Form.Control
              value={text}
              required
              onChange={(e) => setText(e.target.value)}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <div className="mb-3">
            <Form.Check
              checked={!isVideo}
              inline
              label="הוסף תמונות"
              name="group1"
              type="radio"
              id={`inline-radio-1`}
              onChange={radioChangeHandler}
            />
            <Form.Check
              checked={isVideo}
              inline
              label="הוסף סרטון"
              name="group1"
              type="radio"
              id={`inline-radio-2`}
              onChange={radioChangeHandler}
            />
          </div>

          <Uploader isVideo={isVideo} onUplodCallBack={handleFileChange} />

          <div className="mb-3">
            <Button variant="primary" type="submit">
              המשך
            </Button>
            {/* {isLoading && <LoadingBox />} */}
          </div>
        </Form>
      </div>
    </div>
  );
}
