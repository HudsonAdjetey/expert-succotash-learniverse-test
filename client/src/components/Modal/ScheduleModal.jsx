import React, { useState } from "react";
import "../../container/styles/modal.css";
import AlertModal from "../alertModal/AlertModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ScheduleModal = ({ handleIsOpen, closeModal }) => {
  const [scheduleForm, setScheduleForm] = useState({
    className: "",
    courseTitle: "",
    courseLink: "",
    time: "",
    date: "",
    whatsAppLink: "",
  });
  const [listContent, setListContent] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const handleInputs = (e) => {
    setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
  };

  const cancelConfirm = (e) => {
    setIsReady(!isReady);
  };

  const URL = `/api/course`;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const dataToFetch = await axios.post(`${URL}/schedule-class`, data);
      return dataToFetch;
    },
  });

  const handleConfirm = async () => {
    try {
      const res = await mutation.mutateAsync(scheduleForm);
      if (!res) throw new Error("Failed to add class");
      console.log(res);
      setIsReady(false);
    } catch (error) {
      console.log(error);
      setIsReady(false);
    }
  };

  return (
    <div className="sub__main-modal  " onClick={closeModal}>
      <div className="modal__main-container">
        <p className="header__modal-title">Class Details</p>
        <div className="entry__field">
          <label htmlFor="nameOfTitle">Title</label>
          <input
            type="text"
            name="courseTitle"
            value={scheduleForm.courseTitle}
            onChange={handleInputs}
            id="nameOfTitle"
            required
          />
        </div>
        <div className="entry__field">
          <label htmlFor="courseLink">Course Link</label>
          <input
            type="url"
            id="courseLink"
            name="courseLink"
            value={scheduleForm.courseLink}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="entry__field">
          <label htmlFor="nameOfClass">Class Name</label>
          <input
            type="text"
            id="nameOfClass"
            name="className"
            value={scheduleForm.className}
            onChange={handleInputs}
            required
          />
          <p className="warn__message">
            <i className="bi bi-info-circle-fill"></i>
            <span>
              Class Name should match existing class created for this to take
              effect.{" "}
            </span>
          </p>
        </div>

        <div className="entry__field">
          <label htmlFor="timeSchedule">Time</label>
          <input
            type="time"
            id="timeSchedule"
            name="time"
            value={scheduleForm.time}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="entry__field">
          <label htmlFor="dateSchedule">Date</label>
          <input
            type="date"
            id="dateSchedule"
            name="date"
            value={scheduleForm.date}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="entry__field">
          <label htmlFor="link__whatsapp">WhatsApp Link</label>
          <input
            type="url"
            name="whatsAppLink"
            id="link__whatsapp"
            value={scheduleForm.whatsAppLink}
            onChange={handleInputs}
          />
        </div>
        <div className="modalActionBtns">
          <button className="btn btn--primary" onClick={cancelConfirm}>
            Save Changes
          </button>
          <button onClick={handleIsOpen} className="btn btn--primary">
            Cancel
          </button>
        </div>
      </div>
      {isReady && (
        <AlertModal
          msg={"Confirm to schedule"}
          cancelConfirm={cancelConfirm}
          acceptConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ScheduleModal;
