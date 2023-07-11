/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Form, Card, Carousel, ListGroup, Row, Col } from "react-bootstrap";

import {
  useGetPostDetailsQuery,
  useUpdatePostMutation,
} from "../hooks/postHooks";
import { Store } from "../Store";
import { Post } from "../types/Post";
import DownloadButton from "../components/DownloadButton";
import Pdf from "../components/Pdf";
import NoteModal from "../components/NoteModal";

export default function PostPage() {
  const params = useParams();
  const { id: postId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { data, isLoading, error } = useGetPostDetailsQuery(postId!);
  const { mutateAsync: updatePost } = useUpdatePostMutation();
  const [post, setPost] = useState<Post>(data ? data : ({} as Post));

  useEffect(() => {
    setPost(data!);
  }, [data, useGetPostDetailsQuery]);

  const checkedChangedHandler = async (e: any) => {
    const newPost = { ...post };
    newPost.isPending = !e.target.checked;
    setPost(newPost);
    await updatePost(newPost);
  };

  const onAddNoteHandler = async (text: string) => {
    const newPost = { ...post };
    if (!newPost.notes) {
      newPost.notes = [];
    }
    newPost.notes.push(text);
    setPost(newPost);
    await updatePost(newPost);
  };

  const whenString = () => {
    return `${post.when.checkedDays.toString()} -> ${post.when.startDate}-${
      post.when.endDate
    }`;
  };

  const removeNoteHandler = async (text: string) => {
    const newPost = { ...post };

    newPost.notes = newPost.notes?.filter((note) => note !== text);
    setPost(newPost);
    await updatePost(newPost);
  };

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !post ? (
    <MessageBox variant="danger">Post Not Found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Post {postId}</title>
      </Helmet>
      <h1 className="my-3 text-center">Post {postId}</h1>
      <Row>
        <Col>
          <Card style={{ width: "25rem", margin: "auto" }}>
            {post.what.isWithMedia ? (
              post.what.isVideo ? (
                <video src={post.what.files[0]} controls />
              ) : (
                <Carousel>
                  {post.what.files.map((src) => (
                    <Carousel.Item>
                      <Card.Img variant="top" src={src} />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )
            ) : (
              <Card.Img
                variant="top"
                src="../images/noMediaImage.png"
              />
            )}

            <Card.Body>
              {userInfo?.isAdmin ? (
                <Pdf post={post} />
              ) : (
                <>
                  <Card.Title>{post.what.text}</Card.Title>
                  <ListGroup variant="flush">
                    {post.where.map((group: { name: string; id: string }) => (
                      <ListGroup.Item key={group.id}>
                        {group.name}{" "}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Card.Title>{whenString()}</Card.Title>
                </>
              )}
            </Card.Body>
            <Card.Footer
              style={{
                backgroundColor: post.isPending ? "lightcoral" : "lightgreen",
              }}
            >
              {userInfo?.isAdmin ? (
                <div>
                  <div className="d-flex justify-content-around">
                    <span>{post.isPending ? "ממתין לאישור" : "אושר "}</span>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      // label={}
                      checked={!post.isPending}
                      onChange={checkedChangedHandler}
                    />

                    <NoteModal callback={onAddNoteHandler} />
                  </div>
                  <ListGroup className="m-1">
                    {post.notes?.map((note, idx) => (
                      <ListGroup.Item key={idx}>
                        {note}
                        <i
                          className="fas fa-trash inner"
                          onClick={() => removeNoteHandler(note)}
                        ></i>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <DownloadButton post={post} />
                </div>
              ) : post.isPending ? (
                <div>
                  <h5>ממתין לאישור</h5>
                  {post.notes && post.notes.length > 0 && (
                    <div>
                      <h6>הערות:</h6>
                      <ListGroup className="m-1">
                        {post.notes?.map((note, idx) => (
                          <ListGroup.Item key={idx}>{note}</ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              ) : (
                <h5>אושר</h5>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
