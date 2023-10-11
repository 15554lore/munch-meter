import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { fetchImage } from "../fetchImage";
import Image from "react-bootstrap/esm/Image";

export default function FoodImage({ userImages, entry = "none" }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function fetchFoodImage() {
      const newBlob = await fetchImage(entry.image_url);
      setUrl(newBlob);
    }
    fetchFoodImage();
  }, [entry.image_url]);
  if (entry === "none") {
    return <p>Not found! Try uploading some images to see where you stand.</p>;
  }
  return (
    <Container className="bg-secondary rounded-5">
      <Row>
        <p className="my-auto p-1">
          {entry.image_title === ""
            ? "Generic Food Picture"
            : entry.image_title}
        </p>
      </Row>
      <Row>
        <Image
          className="img px-0"
          alt={entry.image_url}
          src={userImages[entry.image_url]}
          width={400}
          height={400}
        />
      </Row>
      <Row>
        <Col>
          <p className="my-auto p-1">Score: {Math.round(entry.score)}</p>
        </Col>
        <Col>
          <p className="my-auto p-1">Rank: {entry.place + 1}</p>
        </Col>
      </Row>
    </Container>
  );
}

/*
<>
      <p>Title: {entry.image_title}</p>
      <p>Score: {Math.round(entry.score)}</p>
      <p>Rank: {entry.place + 1}</p>
      <img
        alt={entry.image_url}
        height="200"
        width="200"
        src={userImages[entry.image_url]}
      ></img>
    </>
*/
