import React, { useEffect, useState } from "react";
import "../../container/styles/modal.css";
import AlertModal from "../alertModal/AlertModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const URL = `/api/course`;

const StudentModal = ({
  closeModal,
  handleIsOpen,
  handleSuspend,
  initialValue,
  handleIsConfirm,
}) => {
  const [data, setData] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const updatedData = {
      ...data,
      newItem: {
        ...data.newItem,
        subscriptionEnd: e.target.value,
      },
    };
    setData(updatedData);
  };
  const [alertModal, setAlertModal] = useState(false);
  const handleAlertModalRise = function () {
    setAlertModal(!alertModal);
  };

  const [stdID, setStdID] = useState();
  const [bodyForm, setBodyForm] = useState({});
  useEffect(() => {
    if (data?.newItem?.indexId) {
      setStdID(data?.newItem?.indexId);
      setBodyForm({
        subscriptionEnd: data.newItem.subscriptionEnd,
        id: data.newItem.index,
      });
    }
  }, [data]);
  // submit update
  const updateExpiry = useMutation({
    mutationFn: async (details) => {
      return axios.patch(`${URL}/student-update/${stdID}`, details);
    },
  });
  const submitUpdate = async () => {
    if (stdID == undefined) {
      return;
    }
    try {
      const res = await updateExpiry.mutateAsync(bodyForm);
      setAlertModal(!alertModal);
    } catch (error) {
      setAlertModal(!alertModal);
      console.log(error);
    }
  };

  const handleSaveClick = (index) => {
    setIsEditing(null);
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
    <div className="sub__main-modal  " onClick={closeModal}>
      <div className="modal__main-container">
        <div>
          <p className="header__modal-title">Student Details</p>
          <div className="text__field">
            <p className="first__title">Student Name:</p>
            <p className="second__title">
              {data?.newItem?.lastName} {data?.newItem?.firstName}{" "}
            </p>
          </div>

          <div className="text__field">
            <p className="first__title">Class:</p>
            <p className="second__title">{data?.newItem?.courseName}</p>
          </div>

          <div className="text__field">
            <p className="first__title">Mobile Number:</p>
            <p className="second__title">{data?.newItem?.contact}</p>
          </div>

          <div className="text__field">
            <p className="first__title">Email Address:</p>
            <p className="second__title">{data?.newItem?.email}</p>
          </div>
        </div>

        <div>
          <p className="header__modal-title">Subscription Details:</p>
          <div className="text__field">
            <p className="first__title">Subscription Date</p>
            <p className="second__title">
              {new Date(data?.newItem?.subscription).toUTCString()}
            </p>
          </div>
          <div className="text__field">
            <p className="first__title">Expiry Date</p>
            {isEditing ? (
              <p>
                <input
                  type="date"
                  value={data.newItem.subscriptionEnd}
                  onChange={handleInputChange}
                />
                <button onClick={handleEditClick}>Save</button>
              </p>
            ) : (
              <p className="second__title " onClick={() => handleEditClick()}>
                {new Date(data?.newItem?.subscriptionEnd).toUTCString()}
              </p>
            )}
          </div>
        </div>

        <div>
          <button className="suspend__account" onClick={handleSuspend}>
            {data?.newItem?.verified == true
              ? "Suspend"
              : data?.newItem?.verified == false && "Activate"}
          </button>
        </div>
        <div className="modalActionBtns">
          <button className="btn btn--primary" onClick={handleAlertModalRise}>
            Save Changes
          </button>
          <button onClick={handleIsOpen} className="btn btn--primary">
            Cancel
          </button>
        </div>
      </div>
      {alertModal && (
        <AlertModal
          msg={"Confirm to update"}
          cancelConfirm={handleAlertModalRise}
          acceptConfirm={submitUpdate}
        />
      )}
    </div>
  );
};

function editFee() {}

export default StudentModal;
