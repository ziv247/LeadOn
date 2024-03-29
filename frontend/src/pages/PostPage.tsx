/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Form, Card, Carousel, ListGroup, Row, Col } from "react-bootstrap";

import {
  useDeletePostMutation,
  useGetPostDetailsQuery,
  useUpdatePostMutation,
} from "../hooks/postHooks";
import { Store } from "../Store";
import { Post } from "../types/Post";
import DownloadButton from "../components/DownloadButton";
import Pdf from "../components/Pdf";
import NoteModal from "../components/NoteModal";
import DeletePostButton from "../components/DeletePostButton";
import { toast } from "react-toastify";

export default function PostPage() {
  const params = useParams();
  const { id: postId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { data, isLoading, error } = useGetPostDetailsQuery(postId!);
  const { mutateAsync: updatePost } = useUpdatePostMutation();
  const { mutateAsync: deletePost } = useDeletePostMutation();
  const navigate = useNavigate();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  const checkedActiveChangedHandler = async (e: any) => {
    const newPost = { ...post };
    newPost.isActive = e.target.checked;
    setPost(newPost);
    await updatePost(newPost);
  };

  const onDeletedHandler = async () => {
    setIsDeleteLoading(true);
    await deletePost(post);
    toast.success("הפוסט נמחק");
    setIsDeleteLoading(false);

    navigate("/");
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

  return isLoading || isDeleteLoading ? (
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
              <Card.Img variant="top" src="../images/noMediaImage.png" />
            )}

            <Card.Body>
              {userInfo?.isAdmin ? (
                // ____ADMIN_________________________

                <Pdf post={post} />
              ) : (
                // ____USER_________________________

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
                backgroundColor: post.isPending
                  ? "lightcoral"
                  : post.isActive
                  ? "lightgreen"
                  : "white",
              }}
            >
              {userInfo?.isAdmin ? (
                // ____ADMIN_________________________
                <div>
                  {post.isPending ? (
                    <div>
                      <div className="d-flex justify-content-around">
                        <h6>ממתין לאישור</h6>
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
                    </div>
                  ) : (
                    <div className="d-flex justify-content-around">
                      <h6>{post.isActive ? "פעיל" : "לא פעיל"}</h6>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={post.isActive}
                        onClick={(e) => e.stopPropagation()}
                        onChange={checkedActiveChangedHandler}
                      />
                    </div>
                  )}
                  <div className="d-flex justify-content-around mt-2">
                    <DownloadButton post={post} />
                    <DeletePostButton
                      post={post}
                      onDeleteClicked={onDeletedHandler}
                    />
                  </div>
                </div>
              ) : // ____USER_________________________

              post.isPending ? (
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
                <div className="d-flex justify-content-around">
                  <h6>{post.isActive ? "פעיל" : "לא פעיל"}</h6>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    checked={post.isActive}
                    onClick={(e) => e.stopPropagation()}
                    onChange={checkedActiveChangedHandler}
                  />
                </div>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
