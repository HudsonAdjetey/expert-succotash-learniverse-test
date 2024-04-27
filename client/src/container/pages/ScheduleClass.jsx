import React, { useEffect, useState } from "react";
import ScheduleModal from "../../components/Modal/ScheduleModal";
import AlertModal from "../../components/alertModal/AlertModal";
import HangScheduleModel from "../../components/Modal/HangScheduleModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ScheduleClass = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [id, setId] = useState(0);
  const [toggle, setToggle] = useState(false);
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const [dataList, setDataList] = useState({});
  useEffect(() => {
    // Add event listener for keydown event when modal is open
    if (isOpen || isConfirm) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }
    return () => {
      // Cleanup by enabling scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isConfirm]);

  const editToggle = (_id) => {
    setToggle(!toggle);
    setId(_id);
    const obj = listContent.find((item) => item._id == _id);
    setDataList(obj);
  };
  const toggleEditModal = () => {
    setToggle(!toggle);
  };

  const [isAlert, setIsAlert] = useState(false);

  const cancelConfirm = (index) => {
    setId(index);
    setIsConfirm(!isConfirm);
  };

  const alertConfirm = (index) => {
    setIsAlert(!isAlert);
  };

  const handleModalClose = (e) => {
    // stop propagation
    e.stopPropagation();
  };
  const [listContent, setListContent] = useState([]);

  const queryClient = useQueryClient();
  // Fetch all the data
  const URL = `/api/course`;
  const query = useQuery({
    queryKey: ["schedule-all"],
    queryFn: async () => {
      const res = await axios.get(`${URL}/schedule-fetch`);
      return res.data;
    },
  });

  const updateData = useMutation({
    mutationFn: async (updatedCourse) => {
      const response = await axios.put(
        `${URL}/schedule-update/${id}`,
        updatedCourse
      );
      return response;
    },
  });

  const deleteData = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${URL}/schedule-remove/${id}`);
      return res;
    },
  });

  const sendRequest = async () => {
    try {
      const res = await updateData.mutateAsync(dataList);

      if (updateData.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["schedule-all"] });
      }
      setIsAlert(!isAlert);
      setToggle(!toggle);
    } catch (error) {
      console.log(error);
      setIsAlert(!isAlert);
      return error.message;
    }
  };
  const confirmDelete = async () => {
    try {
      const res = await deleteData.mutateAsync();

      if (deleteData.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["schedule-all"] });
      }
      setIsConfirm(false);
    } catch (error) {
      setIsConfirm(false);
      console.log(error);
    }
    alert("Deleted" + " " + id);
  };
  queryClient.invalidateQueries({
    queryKey: ["schedule-all"],
    exact: true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess) {
      const dataFetched = query.data;
      setListContent(dataFetched);
    }
  }, [query.data]);

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
  const handleEditInputs = (e) => {
    setDataList({ ...dataList, [e.target.name]: e.target.value });
  };

  return (
    <div className="content__whole allClass__page">
      <div className="addBtn">
        <button onClick={handleIsOpen}>Create Schedule </button>
      </div>
      <div className="content__pageMain">
        <table className="table__schedule-main">
          <thead>
            <tr>
              <th>Title</th>
              <th>Class Name</th>
              <th>Time</th>
              <th>Date</th>
              <th>WhatsApp Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(
              listContent?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.courseTitle}</td>
                    <td>{item.className}</td>
                    <td>{item.time}</td>
                    <td>{formatDateWithSuffix(item.date)}</td>
                    <td>
                      {item.whatsAppLink == "" ? "- - -" : item.whatsAppLink}
                    </td>
                    <td className="t-lin">
                      <span onClick={() => editToggle(item._id)}>Edit</span>
                      <span onClick={() => cancelConfirm(item._id)}>
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* <HangScheduleModel scheduleForm={scheduleForm} /> */}
      {toggle && (
        <HangScheduleModel
          scheduleForm={dataList}
          handleInputs={handleEditInputs}
          cancelConfirm={alertConfirm}
          handleIsOpen={toggleEditModal}
        />
      )}
      {isAlert && (
        <AlertModal
          msg={"Confirm to update"}
          cancelConfirm={alertConfirm}
          acceptConfirm={sendRequest}
        />
      )}
      {isOpen && (
        <ScheduleModal
          handleIsOpen={handleIsOpen}
          handleModalClose={handleModalClose}
        />
      )}
      {isConfirm && (
        <AlertModal
          msg={"Confirm to delete"}
          acceptConfirm={confirmDelete}
          cancelConfirm={cancelConfirm}
        />
      )}
    </div>
  );
};

export default ScheduleClass;
