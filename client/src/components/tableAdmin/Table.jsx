import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TableAdmin = () => {
  return (
    <div className=" content__pageMain">
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
  );
};

export default TableAdmin;
