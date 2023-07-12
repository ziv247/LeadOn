/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Carousel, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Post } from "../types/Post";

export default function PostContainer(props: { post: Post }) {
  const { post } = props;
  const navigate = useNavigate();

  return (
    <Card
      className="mb-3"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/post/${post._id}`)}
    >
      <Card.Header className="d-flex align-items-center">
        <Image
          src={post.user?.facebookData?.fb_image}
          roundedCircle
          width={32}
        />
        <Card.Title style={{ padding: "0px 10px" }}>
          {post.user?.facebookData?.fb_name}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text className="ellipsis">{post.what.text}</Card.Text>
      </Card.Body>
      {post.what.isWithMedia ? (
        post.what.isVideo ? (
          <video
            style={{
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
              height: "155px",
            }}
            src={post.what.files[0]}
            controls
          />
        ) : (
          <Carousel>
            {post.what.files.map((src: string, idx: number) => (
              <Carousel.Item key={idx}>
                <Card.Img
                  variant="bottom"
                  src={src}
                  style={{ height: "155px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )
      ) : (
        <Card.Img
          variant="bottom"
          src="../images/noMediaImage.png"
          style={{ height: "155px" }}
        />
      )}
      <Card.Footer
        style={{
          backgroundColor: post.isPending
            ? "lightcoral"
            : post.isActive
            ? "lightgreen"
            : "white",
        }}
      >
        {post.isPending ? (
          <div className="d-flex justify-content-between">
            <h6>ממתין לאישור</h6>
            {post.isPending && post.notes!.length > 0 && (
              <small>מנהל רשם הערות.</small>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            <h6>{post.isActive ? "פעיל" : "לא פעיל"}</h6>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
}
