import { useState, useEffect } from "react";
import { fetchImage } from "./fetchImage";
import pizzaGif from "../img/pizza.gif";
import sausageGif from "../img/sausage.gif";
import appleGif from "../img/apple.gif";
import chipsGif from "../img/chips.gif";
import Image from "react-bootstrap/Image";
import "./Leaderboard.css";

export const leaderboardEntry = (entry, loading, imgUrls, entriesData) => {
  //a single leaderboard entry, currently quite barebones
  return (
    <div className="list" style={{ justifyContent: "center" }}>
      <li key={entry.id} value={entry.place + 1}>
        <p>
          {entry.place + 1}.{" "}
          {entry.image_title === "" ? "Untitled" : entry.image_title}
        </p>
        <Image
          width="200"
          height="200"
          alt={entry.image_url}
          src={
            loading
              ? [pizzaGif, sausageGif, appleGif, chipsGif][
                  Math.floor(Math.random() * 4)
                ]
              : imgUrls[entriesData.indexOf(entry)]
          }
          rounded
        ></Image>
        <p>Score: {Math.round(entry.score)}</p>
        <p>Creator: {entry.author}</p>
      </li>
    </div>
  );
};

export default function Leaderboard({ userId }) {
  const [page, setPage] = useState(1);
  const [entriesData, setEntriesData] = useState({});
  const [imgUrls, setImgUrls] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //useEffect fetches the relevant data of the images for the current page
    async function fetchEntries() {
      await fetch("/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: page.toString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => setEntriesData(data));
    }
    fetchEntries();
  }, [page]);

  useEffect(() => {
    //useEffect fetches the sources for the images on the current page
    async function fetchEntriesImages() {
      let tempImgUrls = [];
      for (let i = 0; i < entriesData.length; i++) {
        let imageBlob = await fetchImage(entriesData[i].image_url);
        tempImgUrls.push(imageBlob);
        console.log(tempImgUrls);
      }
      setImgUrls(tempImgUrls);
      setTotalPages(parseInt(entriesData[0].totalPages));
      setLoading(false);
    }
    fetchEntriesImages();
  }, [entriesData]);

  console.log(totalPages);

  return Array.isArray(entriesData) ? ( //returns current page of leaderboard or loading message depending on if the data is loaded
    <div className="leaderboard">
      <ol>
        {entriesData.map((entry) =>
          leaderboardEntry(entry, loading, imgUrls, entriesData)
        )}
      </ol>
      <span>
        <button
          disabled={page === 1}
          onClick={() => {
            setPage(page - 1);
            setLoading(true);
          }}
        >
          Previous Page
        </button>{" "}
        Page {page}{" "}
        <button
          disabled={page === totalPages}
          onClick={() => {
            setPage(page + 1);
            setLoading(true);
          }}
        >
          Next Page
        </button>
      </span>
    </div>
  ) : (
    <div className="leaderboard">
      <p>Loading data...</p>
    </div>
  );
}
