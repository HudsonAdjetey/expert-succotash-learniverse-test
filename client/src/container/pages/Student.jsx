import React, { useEffect, useState } from "react";
import RegisterModal from "../../components/Modal/RegisterModal";
import StudentModal from "../../components/Modal/StudentModal";
import AlertModal from "../../components/alertModal/AlertModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const Student = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCreate, setOPenCreate] = useState(false);
  const [isSuspend, setIsSuspend] = useState(false);
  useEffect(() => {
    // Add event listener for keydown event when modal is open
    if (isOpen || openCreate || isSuspend) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }

    return () => {
      // Cleanup by enabling scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen, openCreate]);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent propagation to the parent div
  };
  const openCreateModal = () => {
    setOPenCreate(!openCreate);
  };
  const handleSuspend = () => {
    setIsSuspend(!isSuspend);
  };

  const confirmSuspend = () => {
    setIsSuspend(false);
  };
  const cancelConfirm = (index) => {
    setIsOpen(!isOpen);
    setIsSuspend(!isSuspend);
  };

  const URL = `/api/course`;

  const [data, setData] = useState([]);

  const queryData = useQuery({
    queryKey: ["students"],
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
  let [idValue, setIdValue] = useState(0);
  useEffect(() => {
    if (queryData.data && queryData.isSuccess) {
      const dataFetched = queryData.data.data;
      setData(dataFetched);
    }
  }, [queryData.data]);

  // CREATE STUDENT
  const API_URL = `/api/auth`;

  const mutateStudent = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(API_URL + "/register-student", values);
      return res;
    },
  });
  const [fieldSet, setFieldSet] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: null,
    password: "",
    contact: "",
    username: "",
    guardian: "",
    parentContact: "",
    address: "",
    courses: [],
  });
  const [classRegisterName, setClassRegisterName] = useState({});

  const [popAlert, setPopAlert] = useState(false);
  const isAlertPop = () => {
    setPopAlert(!popAlert);
  };
  const handleInputs = (e) => {
    setFieldSet({ ...fieldSet, [e.target.name]: e.target.value });
  };
  const submitSubscription = async () => {
    try {
      const res = await mutateStudent.mutateAsync(fieldSet);
      setOPenCreate(openCreate);
      setPopAlert(popAlert);
    } catch (error) {
      console.log(error);
    }
  };
  const [id, setID] = useState("");
  const [dataForm, setDataForm] = useState({});
  const [toggle, setIsToggle] = useState(false);
  const handleToggle = () => {
    setIsToggle(!toggle);
  };
  const editToggle = (clickedIndex, id) => {
    const dataFe = queryData.data?.data;
    setIdValue(clickedIndex);
    setIsToggle(!toggle);
    setID(id);
    if (dataFe) {
      const newItem = dataFe.find((item) => clickedIndex === item.index);
      // If newItem is found, update dataForm
      if (newItem) {
        setDataForm({ ...dataForm, newItem });
      }
    }
  };

  const suspendMutation = useMutation({
    mutationKey: ["SuspendUser"],
    mutationFn: async () => {
      const res = await axios.patch(`${URL}/suspend-refetch/${id}`);
      return res;
    },
  });
  const handleSuspendAccount = async (e) => {
    try {
      const suspend = await suspendMutation.mutateAsync();
      console.log(suspend.data.data);
      setIsToggle(!toggle);
    } catch (error) {
      setIsToggle(!toggle);

      console.log(error);
    }
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    if (suspendMutation.isSuccess) {
      // invalidate
      queryClient.invalidateQueries({
        queryKey: ["students"],
        exact: true,
      });
    }
  }, [suspendMutation.isSuccess]);

  const AuthURL = `/api/auth`;
  const BASE = `/api/course`;
  const fetchAllClasses = useQuery({
    queryKey: ["class-all-fetch"],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/course-all`);
      return res.data;
    },
  });
  const [allClassName, setAllClassName] = useState([]);
  useEffect(() => {
    if (fetchAllClasses.isSuccess) {
      const classData = fetchAllClasses.data.classes;
      const newData = classData.map((item) => {
        return item.name;
      });
      setAllClassName(newData);
    }
  }, [fetchAllClasses.isSuccess]);

  const [selectedClasses, setSelectedClasses] = useState([]);

  const [disabledOptions, setDisabledOptions] = useState([]);

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const newlySelected = selectedOptions.filter(
      (option) => !selectedClasses.includes(option)
    );

    setSelectedClasses([...selectedClasses, ...newlySelected]);
    setDisabledOptions([...disabledOptions, ...newlySelected]);
  };

  const handleCancel = (selectedClass) => {
    const updatedSelected = selectedClasses.filter(
      (option) => option !== selectedClass
    );
    setSelectedClasses(updatedSelected);

    const updatedDisabled = disabledOptions.filter(
      (option) => option !== selectedClass
    );
    setDisabledOptions(updatedDisabled);
  };

  const [monthFee, setMonthFee] = useState("");
  const [registerInfo, setRegisterInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    username: "",
    email: "",
    password: "",
    address: "",
    courses: [],
    month: "",
  });
  const [obj, setObj] = useState([]);
  useEffect(() => {
    let updatedRegisterInfo = { ...registerInfo };

    if (selectedClasses.length > 0) {
      const newData = selectedClasses.map((item) => ({ name: item }));
      updatedRegisterInfo = {
        ...updatedRegisterInfo,
        courses: newData,
      };
    } else {
      updatedRegisterInfo.courses = [];
    }

    updatedRegisterInfo.month = Number(monthFee);

    setRegisterInfo(updatedRegisterInfo);
  }, [selectedClasses, monthFee]);

  const [isModal, setIsModal] = useState(false);

  const handleIsModal = () => {
    setIsModal(!isModal);
  };

  const [modalAlert, setModalAlert] = useState(false);
  const alertIsModal = () => {
    setModalAlert(!modalAlert);
  };

  const handleInputValue = (e) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };
  const registerMutate = useMutation({
    mutationFn: async (data) => {
      return await axios.post(`${AuthURL}/register-student`, data);
    },
  });
  const submitForm = async () => {
    if (selectedClasses.length < 1) {
      alert("Select at least one class");
      return;
    } else if (registerInfo.month == "") {
      alert("Please select the Monthly Fee");
    } else if (
      registerInfo.firstName == "" ||
      registerInfo.lastName == "" ||
      registerInfo.email == "" ||
      registerInfo.password == "" ||
      registerInfo.username == ""
    ) {
      alert("All fields are required");
      return;
    }
    setModalAlert(!modalAlert);
    setIsModal(!isModal);

    try {
      const res = await registerMutate.mutateAsync(registerInfo);
      console.log(res.data.message);
    } catch (error) {
      setIsModal(!isModal);

      setModalAlert(!modalAlert);
      console.log(error);
    }
  };
  useEffect(() => {
    if (registerMutate.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["students"],
        exact: true,
      });
    }
  }, [registerMutate.isSuccess]);
  return (
    <div className="content__whole allClass__page">
      <div className="addBtn">
        <button onClick={handleIsModal}>Create Student</button>
      </div>

      {isModal && (
        <RegisterModal
          handleInputs={handleInputValue}
          selectedClasses={selectedClasses}
          disabledOptions={disabledOptions}
          allClassName={allClassName}
          registerInfo={registerInfo}
          monthFee={monthFee}
          submitForm={alertIsModal}
          handleIsModal={handleIsModal}
          handleSelectChange={handleSelectChange}
          setMonthFee={setMonthFee}
        />
      )}
      {modalAlert && (
        <AlertModal
          msg={"Confirm to create"}
          acceptConfirm={submitForm}
          cancelConfirm={alertIsModal}
        />
      )}
      <div className=" content__pageMain">
        <table className="student__table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Subscription Date</th>
              <th>End Date Date</th>
              <th>Action</th>
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
                  <td className="t-lin">
                    <span onClick={() => editToggle(item.index, item.indexId)}>
                      {" "}
                      Edit
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toggle && (
        <StudentModal
          handleSuspend={handleSuspendAccount}
          handleIsOpen={handleToggle}
          initialValue={dataForm}
        />
      )}

      {isSuspend && (
        <AlertModal
          msg={"Confirm to suspend"}
          acceptConfirm={confirmSuspend}
          cancelConfirm={cancelConfirm}
        />
      )}

      {popAlert && (
        <AlertModal
          msg={"Confirm to create student"}
          acceptConfirm={submitSubscription}
          cancelConfirm={isAlertPop}
        />
      )}
    </div>
  );
};
const EditItem = ({ current, collection, setCollection, setIdValue }) => {
  function handleUpdate() {
    setIdValue(-1);
  }
  function handleIp(e) {
    const newListValue = collection.map((col, index) =>
      col ? { ...col, subscriptionEnd: e.target.value } : col
    );
    setCollection(newListValue);
  }

  return (
    <>
      <input type="text" value={current.subscriptionEnd} onChange={handleIp} />
    </>
  );
};
export default Student;
