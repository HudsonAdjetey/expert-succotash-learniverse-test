import React from "react";

const HandleSelection = (
  index,
  { setSelectedClasses, setFormData, selectedClasses }
) => {
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

export default HandleSelection;
