import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
const Card = ({ classSwitch, dataInfo }) => {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  const submit = (link) => {
    window.location.href = link;
  };
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
  return (
    <div className="card__holder-course">
      <motion.div
        className="card__main-course"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {dataInfo?.map((content, index) => {
          return (
            <motion.div variants={item} key={index} className="course__card">
              <p className="className__header">
                {content.courseName || content.name}
              </p>

              <div className="title__class-sub">
                <p className="subject__name">
                  <span>Lesson: </span>
                  <span>{content.courseTitle}</span>
                </p>
                <p className="time">
                  <span>Time: </span>
                  <span>{content.time}</span>
                </p>
                <p className="time">
                  <span>Date:</span>
                  <span>
                    {content?.date !== undefined
                      ? formatDateWithSuffix(content?.date)
                      : " No lesson so soon"}{" "}
                  </span>
                </p>
              </div>

              <div className="join__btn">
                <button onClick={() => submit(content.courseLink)}>
                  Join now
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

/* const key = CryptoJS.enc.Utf8.parse('encryption key goes here');
const iv = CryptoJS.enc.Utf8.parse('initialization vector goes here');

const decrypted = CryptoJS.AES.decrypt(this.state.encrypted, key, {
  keySize: 128 / 8,
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});

const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);
this.setState({ decrypted: decryptedMessage }); */

export default Card;
