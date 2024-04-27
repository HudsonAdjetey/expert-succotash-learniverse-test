import React, { memo, useEffect, useState } from "react";

const Payment = memo(
  ({
    line,
    selectedClass,
    perMonth,
    thirdMonth,
    monthFee,
    threeMonth,
    admissionThird,
    admissionPer,
    active,
    setActive,
    activeTabToggler,
    totalAmount,
  }) => {
    return (
      <div className={line == 4 ? "activeTab" : "unActive"}>
        <div className="basicInfo__container ">
          <h3 className="basic__infoHeader">Subscribe to class</h3>

          <div className="payment__select">
            <div
              className={`card ${active == 1 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(1)}
            >
              <h4>Bill monthly</h4>
              <p>+GHS{admissionPer} once (Admission)</p>
            </div>
            <div
              className={`card ${active == 2 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(2)}
            >
              <h4>Bill every 3 months</h4>
              <p>+GHS{admissionThird} once (Admission)</p>
            </div>
          </div>
          <h4>Check Out</h4>
          <div className="check__out">
            <p className="bill__month flex-row">
              <span>
                {active == 1
                  ? "Per month"
                  : active == 2
                  ? "3 months billing basis"
                  : ""}
              </span>
              <span>
                {active == 1
                  ? `GHS ${monthFee?.toFixed(2)}`
                  : active == 2
                  ? `GHS ${threeMonth?.toFixed(2)}`
                  : ""}
              </span>
              <span className="suspend">
                +
                {active == 1 ? admissionPer : active == 2 ? admissionThird : ""}
              </span>
            </p>

            {/* INDIVIDUAL CLASS GOES HERE */}
            <div className="individual__class bill__month">
              <h4>Selected Classes</h4>
              <ul>
                {selectedClass?.map((item, index) => {
                  return (
                    <li key={index}>
                      <span>{item.name}</span>

                      <span>GHS {item.price}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="totalAmounts bill__month">
              <span>Total Amounts:</span>
              <span>GHS {totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Payment;
