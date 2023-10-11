import { useEffect, useState } from "react";
import { fetchImage } from "./fetchImage";

import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ImagePair.css";

// Works perfectly when React.StrictMode is removed - for production

export default function ImagePair() {
  const [open, setOpen] = useState("1");
  const [imgs, setImgs] = useState([]);
  const [imgIds, setImgIds] = useState([]);
  const [imageTitles, setImageTitles] = useState([]);

  useEffect(() => {
    async function initialFilePaths() {
      const [file1, file2] = await getFilePaths();
      setImgIds([file1.path, file2.path]);
      setImageTitles([file1.title, file2.title]);
    }
    initialFilePaths();
  }, []);

  useEffect(() => {
    async function fetchInitialImages() {
      fetchImages();
    }

    if (imgIds.length > 0) {
      fetchInitialImages();
    }
  }, [imgIds]);

  //Fetches file path of random image from server
  // const getFilePath = async () => {
  //   const pathres = await fetch("/random_img");
  //   const filePath = await pathres.json();
  //   console.log(filePath);
  //   return filePath.path;
  // };

  const getFilePaths = async () => {
    const response = await fetch("/random_img");
    const fileData = await response.json();
    return [fileData.file1, fileData.file2];
  };

  //Fetches a pair of images
  const fetchImages = async () => {
    setOpen("0");
    //Uses promise all to wait for both images to load before displaying
    const [img1url, img2url] = await Promise.all([
      fetchImage(imgIds[0]),
      fetchImage(imgIds[1]),
    ]);
    setImgs([img1url, img2url]);
    setOpen("1");
  };

  //Sends post request to server to update the ranking of an image when it is selected
  const updateRanking = async (winnerUrl, loserUrl) => {
    await fetch("/update_ranking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ winnerUrl: winnerUrl, loserUrl: loserUrl }),
    });
  };

  const handleClick = async (imgNum) => {
    //0 = image on left, 1 = image on right
    const otherImgNum = 1 - imgNum;
    const [file1, file2] = await getFilePaths(); //Promise.all([getFilePath(), getFilePath()])
    console.log("File:");
    console.log(file1);
    setImgIds([file1.path, file2.path]);
    setImageTitles([file1.title, file2.title]);
    updateRanking(imgIds[imgNum], imgIds[otherImgNum]);
    fetchImages();
  };

  return (
    <div className="ImagePair">
      <Container>
        <Row className="mt-4">
          <Col className="d-flex justify-content-center align-items-center">
            <div class="vstack gap-3">
              <h3 className="text-center">
                {imageTitles[0] === "" ? "No Title" : imageTitles[0]}
              </h3>
              <Image
                src={imgs[0]}
                height="500"
                width="500"
                onClick={() => handleClick(0)}
                rounded
                className="image1"
              />
            </div>
          </Col>
          <Col className="d-flex justify-content-center align-items-center my-auto">
            <p className="circle">
              <strong>VS</strong>
            </p>
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <div class="vstack gap-3">
              <h3 className="text-center">
                {imageTitles[1] === "" ? "No Title" : imageTitles[1]}
              </h3>
              <Image
                src={imgs[1]}
                height="500"
                width="500"
                onClick={() => handleClick(1)}
                rounded
                className="image2"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
