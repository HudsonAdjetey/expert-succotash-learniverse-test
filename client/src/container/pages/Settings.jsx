import React, { useEffect, useState } from "react";
import Set from "../../components/Settings/Set";
import AlertModal from "../../components/alertModal/AlertModal";

const Settings = () => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  useEffect(() => {
    // Add event listener for keydown event when modal is open
    if (isConfirm || isAlert) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }
    return () => {
      // Cleanup by enabling scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isConfirm]);

  const handleAlert = () => {
    setIsAlert(!isAlert);
  };

  return (
    <>
      <Set />
    </>
  );
};

export default Settings;
