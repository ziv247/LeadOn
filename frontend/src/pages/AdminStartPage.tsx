import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Card, Carousel, Col, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
import {
  useGetAllPostsQuery,
  useGetPostHistoryQuery,
} from "../hooks/postHooks";
import LoadingBox from "../components/LoadingBox";
import { Post } from "../types/Post";
import PostContainer from "../components/PostContainer";
import SortingBar from "../components/SortingBar";

export default function AdminStartPage() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllPostsQuery();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data, isLoading]);

  const checkoutHandler = (filteredArray) => {
    console.log(filteredArray);
    setPosts(filteredArray);
  };

  return (
    <div>
      <Helmet>
        <title>פוסטים</title>
      </Helmet>
      {/* <h1>פוסטים</h1> */}
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Row>
          <Col md={10}>
          <SortingBar posts={data} filteredListCB={checkoutHandler} />

            {posts!.length === 0 ? (
              <MessageBox>לא נמצאו פוסטים</MessageBox>
            ) : (
              <Row>
                
                {posts!.map((post: Post) => (
                  <Col
                    md={3}
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                  >
                    <PostContainer post={post} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
          <Col md={2}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      {/* סה"כ {posts?.filter((post) => post.isPending)!.length}{" "} */}
                      פוסטים שלא אושרו
                    </h3>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
