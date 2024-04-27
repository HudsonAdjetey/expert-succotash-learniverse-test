import React, { useEffect, useState } from "react";
import { WelcomePage } from "../../constants/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = `/api/course`;
const Banner = () => {
  const [image, setImage] = useState("");
  const queryURL = useQuery({
    queryKey: ["url"],
    queryFn: async () => {
      const res = await axios.get(`${URL}/banner-display`);
      return res.data;
    },
  });

  useEffect(() => {
    if (queryURL.isSuccess && queryURL?.data) {
      const data = queryURL.data.data;
      setImage(data);
    }
  }, [queryURL.data]);

  return (
    <div className="banner__img">
      <img src={image} alt="bannerImage" />
    </div>
  );
};

export default Banner;
