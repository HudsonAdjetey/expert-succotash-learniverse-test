import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import Header from "../../components/nav/Header";
import Banner from "../../components/banner/Banner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import env from "react-dotenv";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const userID = user.userID;
  const URL = `/api/course`;

  const [dataContainer, setData] = useState([]);

  const queryData = useQuery({
    queryKey: ["classList"], // unique string to identify this request (like a cache key)
    queryFn: async () => {
      const res = await axios.get(`${URL}/ind-classes/`);
      return res;
    },
  });
  useEffect(() => {
    if (queryData?.data && queryData.isSuccess) {
      const allClasses = queryData.data.data.data;
      setData(allClasses);
    }
  }, [queryData]);

  return (
    <section className="home">
      {/* HEADER */}
      <Header />
      {/* HEADER */}

      {/* BANNER */}
      <div className="content__whole">
        <Banner />
        {/* BANNER */}

        {/* CARD CONTAINER */}
        <div className="home__content-container">
          <h4>Classes</h4>
          <div className="card__holder-course">
            <Card dataInfo={dataContainer} />
          </div>
        </div>
      </div>
      {/* CARD CONTAINER */}
    </section>
  );
};

export default Home;
