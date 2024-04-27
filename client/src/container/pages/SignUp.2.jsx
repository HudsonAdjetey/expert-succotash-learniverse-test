import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BasicInfo from "../../components/basicInfo/BasicInfo";
import ClassInfo from "../../components/classInfo/ClassInfo";
import ParentalInfo from "../../components/parentalInfo/ParentalInfo";
import Payment from "../../components/payment/Payment";
import { getStepText } from "./SignUp";
import PaystackPop from "@paystack/inline-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/userSlice";
const CourseUrl = `/api/course/`;

export const SignUp = () => {
  // Get all classes for the class list.
  const [lineColor, setLineColor] = useState(1);
  const [telPhone, setTelPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImageFile] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [active, setActive] = useState(1);

  const dispatch = useDispatch();

  // Mutations for API calls to backend server
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    guardian: "",
    parentContact: "",
    photoUrl: "",
    address: "",
    courses: [],
    admissionPer: "",
    admissionThird: "",
    admission: "",
    month: "",
    amount: 0,
    totalCosts: 0,
    perMonth: 0,
    thirdMonth: 0,
    monthFee: 0,
  });

  const [mainData, setMainData] = useState([]);
  const [perMonth, setPerMonth] = useState("");
  const [monthAmount, setMountAmount] = useState("");
  const queryFunction = useQuery({
    queryKey: ["getCourses"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${CourseUrl}/course-all`);
        return res.data;
      } catch (error) {
        throw new Error("Failed to fetch courses");
      }
    },
  });

  TODO: "REMINDERS";
  // Ensure mainData state reflects the latest fetched data(queried)
  useEffect(() => {
    if (queryFunction.isSuccess && queryFunction.data) {
      setMountAmount(queryFunction.data.monthFee);
      setPerMonth(queryFunction.data.admission);
      setMainData(queryFunction.data.classes);
    }
  }, [queryFunction.isSuccess, queryFunction.data]);
  // Now mainData state should contain the fetched data nothing else

  const handleInputs = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [number, setPhoneNumber] = useState();

  const handleInputChange = (value) => {
    validateNumber(setPhoneNumber(value));
    setFormData({ ...formData, contact: value });
  };

  const handleParentContact = (value) => {
    setFormData({ ...formData, parentContact: value });
  };

  const validateNumber = (numberPhone) => {
    const phoneNumberValidate = /^\d{10}$/;
    if (phoneNumberValidate.test(Number(numberPhone))) {
      return true;
    } else {
      return false;
    }
  };

  const handleSelection = (index) => {
    const selectedIndex = selectedClasses.findIndex(
      (item) => item.index === index
    );
    if (selectedIndex === -1) {
      const selectedClass = mainData.find((item) => item.index === index);
      setSelectedClasses([...selectedClasses, selectedClass]);
      setFormData({
        ...formData,
        courses: [...formData.courses, selectedClass],
      });
    } else {
      const updatedClasses = selectedClasses.filter(
        (item) => item.index !== index
      );
      setFormData({
        ...formData,
        courses: updatedClasses,
      });
      setSelectedClasses(updatedClasses);
    }
  };
  const isClassSelected = (index) => {
    return selectedClasses.some((item) => item.index === index);
  };

  const [amount, setAmount] = useState();

  useEffect(() => {
    const prices = selectedClasses.map((item) => {
      return item.price;
    });
    let init = 0;
    prices.forEach((price) => {
      init += price;
    });
    let monthFee = formData.monthFee;
    let adminFee = formData.admission;
    const totalMonth = Number(monthFee) + Number(adminFee);
    init += totalMonth;
    setAmount(init);
    setFormData({ ...formData, courseAmounts: init });
  }, [amount, selectedClasses, formData.admission, formData.monthFee]);

  const activeTabToggler = (index) => {
    setActive(index);
  };

  useEffect(() => {
    if (active == 1 && perMonth !== "") {
      setFormData({
        ...formData,
        admissionThird: Number(perMonth) * 2,
        admissionPer: Number(perMonth),
        perMonth: Number(monthAmount),
        month: 1,
        admission: Number(perMonth),
        monthFee: Number(monthAmount),
      });
    } else if (active == 2) {
      setFormData({
        ...formData,
        admissionThird: Number(perMonth) * 2,
        admission: Number(perMonth) * 2,
        monthFee: Number(monthAmount) * 2,
        admissionPer: perMonth,
        thirdMonth: Number(monthAmount) * 2,
        month: 3,
      });
    }
  }, [active, perMonth, monthAmount]);
  const [successStatus, setSuccessStatus] = useState();
  const URL = `/api/auth/`;
  const mutation = useMutation({
    mutationKey: "signUp",
    mutationFn: (data) => {
      return axios.post(`${URL}register`, data);
    },
  });

  const courseRegisterMutation = useMutation({
    mutationKey: "courseRegistration",
    mutationFn: (data) => {
      console.log("data :>> ", data);
      return axios.post("/api/course/register-course", data);
    },
  });
  const cancelRegistration = useMutation({
    mutationKey: "cancelRegistration",
    mutationFn: (id) => {
      return axios.delete(`/api/course/cancel-course/${id}`);
    },
  });
  const failedPayment = async (courseId) => {
    try {
      const cancel = await cancelRegistration.mutateAsync(courseId);
      // Further actions or error handling based on cancellation response
      console.log("Cancelled", cancel);
    } catch (error) {
      console.error("Cancellation failed:", error);
      // Handle cancellation failure
    }
  };
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutation.mutateAsync(formData);

      const courseRes = await courseRegisterMutation.mutateAsync({
        courses: selectedClasses,
        month: formData.month,
      });
      let idValue = courseRes.data.data._id;
      if (!courseRes) {
        return;
      }
      const payStack = new PaystackPop();
      payStack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_KEY,
        amount: formData.courseAmounts * 100,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.firstName,
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        onClose: function () {
          failedPayment(idValue);
        },
        callback: function async(response) {
          let message = "Payment complete! Reference: " + response.reference;
          alert(message);
          if (response.status == "success") {
            dispatch(setUser(res.data.data));
            <Navigate to={"/"} replace />;
            navigate("/");
            console.log(response);
          } else {
            failedPayment(idValue);
          }

          // Execute different actions or show error messages
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const continueLine = () => {
    if (lineColor == 3) {
      if (selectedClasses.length < 1) {
        alert("Select a class");
        return;
      }
    }
    if (lineColor < 4) {
      setLineColor((prev) => prev + 1);
    }
  };
  const backLine = () => {
    if (lineColor > 0) {
      setLineColor((prev) => prev - 1);
    }
  };

  return (
    <section className="signUp">
      <div className="topHeader flex-row">
        <div className="logo__name">
          <h1>
            Learn<span>iverse</span>{" "}
          </h1>
        </div>
        <div className="newUser__link">
          <span>Already have an account</span>
          <Link to={"/login"}>Sign In</Link>
        </div>
      </div>

      {/* TABS */}
      <ul className="tabs__container">
        {[1, 2, 3, 4].map((step) => (
          <li key={step}>
            <span className={`number ${lineColor === step ? "active" : ""}`}>
              {lineColor > step ? (
                <i className="bi bi-check-lg changeColor"></i>
              ) : (
                `0${step}`
              )}
            </span>
            <span className="text_info">{getStepText(step)}</span>
            {step < 4 && (
              <span className={`line ${lineColor === step ? "active" : ""}`} />
            )}
          </li>
        ))}
      </ul>
      {/* FORM CONTAINER */}
      <div className="form__pagesInfo">
        <BasicInfo
          line={lineColor}
          firstName={formData.firstName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          lastName={formData.lastName}
          email={formData.email}
          contact={formData.number}
          handleInputs={handleInputs}
          handleInputChange={handleInputChange}
          password={formData.password}
        />
        {/* PARENTAL INFO */}
        <ParentalInfo
          line={lineColor}
          handleInputChange={handleParentContact}
          parentContact={formData.parentContact}
          address={formData.address}
          handleInputs={handleInputs}
          guardian={formData.guardian}
        />

        {/* CLASS INFO */}
        <ClassInfo
          line={lineColor}
          selectedClasses={selectedClasses}
          dataInfo={mainData}
          isClassSelected={isClassSelected}
          handleSelection={handleSelection}
        />

        {/* PAYMENT */}
        <Payment
          line={lineColor}
          selectedClass={formData.courses}
          admissionPer={formData.admissionPer}
          activeTabToggler={activeTabToggler}
          setActive={setActive}
          active={active}
          admissionThird={formData.admissionThird}
          monthFee={formData.perMonth}
          threeMonth={formData.thirdMonth}
          totalAmount={amount}
        />

        <div className="pro__select flex-row">
          {lineColor > 1 ? (
            <button className="proceedBtn" onClick={backLine}>
              Back
            </button>
          ) : null}

          <button
            onClick={continueLine}
            style={lineColor <= 3 ? { display: "block" } : { display: "none" }}
            className="proceedBtn"
          >
            {lineColor <= 3 && "Proceed"}
          </button>
          {lineColor == 4 && (
            <button className="proceedBtn" onClick={onSubmit}>
              Register
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
