import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const useFetch = (options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.token);
  let user = useSelector((state) => state.user.userObj);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    if (token) {

      axios({
        method: "GET",        url: options.url,
        headers: { Authorization: "Bearer " + token },
      })
        .then((data) => {
          if (isMounted) {
            setData(data);
            setError(null);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setError(error);
            setData(null);
          }
        })
        .finally(() => isMounted && setLoading(false));
    }

    // fetch(url, options)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (isMounted) {
    //       setData(data);
    //       setError(null);
    //     }
    //   })
    //   .catch((error) => {
    //     if (isMounted) {
    //       setError(error);
    //       setData(null);
    //     }
    //   })
    //   .finally(() => isMounted && setLoading(false));

    return () => (isMounted = false);
  }, []);

  return { loading, error, data };
};

export default useFetch;
