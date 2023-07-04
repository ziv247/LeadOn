import React from "react";
import { Card, Carousel, Image } from "react-bootstrap";

export default function PostContainer({ post }) {
  console.log(post);
  return (
    <Card className="mb-3" style={{ cursor: "pointer" }}>
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
      {post.what.isVideo ? (
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
      )}
      <Card.Footer
        style={{
          backgroundColor: post.isPending ? "lightcoral" : "lightgreen",
        }}
      >
        {post.isPending ? "ממתין לאישור" : "אושר "}
      </Card.Footer>
    </Card>
  );
}
