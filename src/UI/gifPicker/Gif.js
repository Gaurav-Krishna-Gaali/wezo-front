import classes from "./gif.module.css";
import { useEffect, useState } from "react";
import Card from "../Card";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import close from "../../UI/imgs/close.svg";
import { giphyTrendingURL, giphySearchURL } from "../../URL/signUpURL";

const loadGifs = async (limit, offset, q, setGifs, setHasMore) => {
  try {
    const api = giphySearchURL;
    const total = api + "&limit=" + limit + "&offset=" + offset + "&q=" + q;

    const trending = giphyTrendingURL + "&limit=" + limit + "&offset=" + offset;

    const gifs = await axios.get(q === "" ? trending : total);
    const list = gifs.data.data;

    const cheese = list.map((e) => {
      //   return { url: e.images.fixed_height_small.url, id: e.id };
      return { url: e.images.fixed_width_small.url, id: e.id };
    });

    setGifs((p) => {
      if (offset === 0) {
        return [...cheese];
      } else {
        return [...p, ...cheese];
      }
    });

    console.log(gifs);

    if (gifs.data.pagination.total_count <= gifs.data.pagination.offset) {
      setHasMore(false);
    }

    console.table("cheese ", cheese);
  } catch (err) {
    console.log("err loading gifs", err);
  }
};

const Gif = (props) => {
  const [gifs, setGifs] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log("searching....");

    loadGifs(15, page * 15, search, setGifs, setHasMore);
  }, [page, search, hasMore]);

  let typingTimer;
  let doneTypingInterval = 800;

  const typingHandler = (e) => {
    console.log(e.target.value);

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      doneTyping(e);
    }, doneTypingInterval);
  };

  const doneTyping = (e) => {
    console.log("done typing", e.target.value);

    setPage(0);
    setSearch(e.target.value.trim());
  };

  const gifSelect = (id, url) => {
    props.setGif({ id: id, url: url });
    console.log("selected gif id ,", id);
  };

  const closeHandler = () => {
    props.setShowGif();
  };

  return (
    <div className={classes.backdrop}>
      <Card custom={classes.card}>
        <div className={classes.topSection}>
          <h1 className={classes.heading}>GIF's</h1>
          <img src={close} alt="" onClick={closeHandler} />
        </div>
        <input className={classes.input} placeholder="type here to search gif" type="text" onChange={typingHandler} />
        <div id="listOfGifs" className={classes.wholeContainer}>
          <InfiniteScroll
            dataLength={gifs.length}
            next={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            scrollableTarget="listOfGifs"
          >
            <div className={classes.gifContainer}>
              {gifs.length > 0
                ? gifs.map((e, i) => {
                    return (
                      <img
                        onClick={() => {
                          gifSelect(e.id, e.url);
                        }}
                        className={classes.gif}
                        src={e.url}
                        key={i}
                        alt=""
                      />
                    );
                  })
                : "loading..."}
            </div>
          </InfiniteScroll>
        </div>
      </Card>
    </div>
  );
};

export default Gif;
