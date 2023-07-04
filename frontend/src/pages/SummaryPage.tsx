import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Button,
  Card,
  Col,
  Image,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Row,
  Carousel,
} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import {
  useCreatePostMutation,
  useUploadFilesMutation,
} from "../hooks/postHooks";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { What } from "../types/Post";

export default function SummaryPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo, filesList } = state;

  useEffect(() => {
    if (!filesList) {
      navigate("/what");
    }
  }, [filesList, navigate]);

  const [what, setWhat] = useState(
    localStorage.getItem("whatSection")
      ? JSON.parse(localStorage.getItem("whatSection")!)
      : {}
  );

  const [where, setWhere] = useState(
    localStorage.getItem("whereSection")
      ? JSON.parse(localStorage.getItem("whereSection")!)
      : []
  );
  const [when, setWhen] = useState(
    localStorage.getItem("whenSection")
      ? JSON.parse(localStorage.getItem("whenSection")!)
      : {}
  );

  const whenString = () => {
    return `${when.checkedDays.toString()} -> ${when.startDate}-${
      when.endDate
    }`;
  };

  const { mutateAsync: createPost, isLoading } = useCreatePostMutation();

  const placePostHandler = async () => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const uploadedFiles = await useUploadFilesMutation(filesList);
      what.files = uploadedFiles;

      const data = await createPost({
        what,
        where,
        when,
      });
      // dispatch({ type: "CART_CLEAR" });
      localStorage.removeItem("whatSection");
      localStorage.removeItem("whereSection");
      localStorage.removeItem("whenSection");
      navigate(`/post/${data.post._id}`);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  return (
    <div>
      <Helmet>
        <title>לידאון - סיכום</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

      <div className="container ">
        <h1 className="my-3">סיכום</h1>
        <Card style={{ width: "25rem", margin: "auto" }}>
          {what.isVideo ? (
            <video src={URL.createObjectURL(filesList[0])} controls />
          ) : (
            <Carousel>
              {filesList?.map((src) => (
                <Carousel.Item>
                  <Card.Img variant="top" src={URL.createObjectURL(src)} />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          <Card.Body>
            <Card.Title>{what.text}</Card.Title>
            <ListGroup variant="flush">
              {where.map((group: { name: string; id: string }) => (
                <ListGroup.Item key={group.id}>{group.name}</ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Title>{whenString()}</Card.Title>
            <Button onClick={placePostHandler} variant="primary">
              שמור
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
