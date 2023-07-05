/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect,  useState } from "react";
import {  useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Form, Card, Carousel, ListGroup } from "react-bootstrap";

import {
  useGetPostDetailsQuery,
  useUpdatePostMutation,
} from "../hooks/postHooks";
import { Store } from "../Store";
import { Post } from "../types/Post";
import DownloadButton from "../components/DownloadButton";
import Pdf from "../components/Pdf";

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

  const checkedChangedHandler = async (e:any) => {
    const newPost = { ...post };
    newPost.isPending = !e.target.checked;
    setPost(newPost);
     await updatePost(newPost);
  };

  const whenString = () => {
    return `${post.when.checkedDays.toString()} -> ${post.when.startDate}-${
      post.when.endDate
    }`;
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
      <Card style={{ width: "25rem", margin: "auto" }}>
        {post.what.isVideo ? (
          <video src={post.what.files[0]} controls />
        ) : (
          <Carousel>
            {post.what.files.map((src) => (
              <Carousel.Item>
                <Card.Img variant="top" src={src} />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        <Card.Body>
          {userInfo?.isAdmin ? (
            <Pdf post={post} />
          ) : (
            <>
              <Card.Title>{post.what.text}</Card.Title>
              <ListGroup variant="flush">
                {post.where.map((group: { name: string; id: string }) => (
                  <ListGroup.Item key={group.id}>{group.name} </ListGroup.Item>
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
              <Form.Check
                type="switch"
                id="custom-switch"
                label={post.isPending ? "ממתין לאישור" : "אושר "}
                checked={!post.isPending}
                onChange={checkedChangedHandler}
              />
              <DownloadButton post={post} />
            </div>
          ) : post.isPending ? (
            "ממתין לאישור"
          ) : (
            "אושר "
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}
