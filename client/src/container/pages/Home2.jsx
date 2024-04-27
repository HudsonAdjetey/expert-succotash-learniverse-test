import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import Header from "../../components/nav/Header";
import Banner from "../../components/banner/Banner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import env from "react-dotenv";
import TableAdmin from "../../components/tableAdmin/Table";

const AdminHome = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const URL = `/api/course`;

  const queryStudent = useQuery({
    queryKey: ["students", "Admin"],
    queryFn: async () => {
      const fetchedData = await axios.get(`${URL}/all-students`);
      return fetchedData.data;
    },
  });

  function formatDateWithSuffix(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = day < 30 ? day % 20 : day % 30;
    const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];

    const formattedDate = `${day}${suffix} ${month} ${year}`;

    return formattedDate;
  }

  useEffect(() => {
    if (queryStudent.data && queryStudent.isSuccess) {
      const dataFetched = queryStudent.data.data.sort((a, b) =>
        a.firstName > b.firstName ? 1 : -1
      );
      setData(dataFetched);
    }
  }, [queryStudent]);

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
          <h4>Students</h4>
          <div className="card__holder-course">
            <div className="content__pageMain ">
              <table className="student__table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Subscription Date</th>
                    <th>End Date Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.firstName + " " + item.lastName}</td>
                        <td>{item.courseName}</td>
                        <td>{formatDateWithSuffix(item.subscription)}</td>
                        <td>{formatDateWithSuffix(item.subscriptionEnd)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* CARD CONTAINER */}
    </section>
  );
};

// how to use .env in react ?
export default AdminHome;
