/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
import { useGetPostHistoryQuery } from "../hooks/postHooks";
import LoadingBox from "../components/LoadingBox";
import { Post } from "../types/Post";
import PostContainer from "../components/PostContainer";
import SortingBar from "../components/SortingBar";

export default function UserStartPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { data, isLoading } = useGetPostHistoryQuery();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (userInfo?.isAdmin) {
      navigate("/admin");
    }
  }, [userInfo, navigate]);

  const checkoutHandler = (filteredArray: Post[]) => {
    setPosts(filteredArray);
  };

  const addPostHandler = () => {
    navigate("/signin?redirect=/what");
  };

  return (
    <div>
      <Helmet>
        <title>פוסטים</title>
      </Helmet>
      <h1>פוסטים</h1>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Row>
          <Col md={10}>
            <SortingBar posts={data!} filteredListCB={checkoutHandler} />
            {posts!.length === 0 ? (
              <MessageBox>
                אין פוסטים להוספה . <Link to="/what">לחץ כאן</Link>
              </MessageBox>
            ) : (
              <Row>
                {posts!.map((post: Post) => (
                  <Col
                    key={post._id}
                    md={3}
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
                    <h3>סה"כ {posts?.length} פוסטים</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={addPostHandler}
                        // disabled={cartItems.length === 0}
                      >
                        הוסף פוסט חדש
                      </Button>
                    </div>
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
