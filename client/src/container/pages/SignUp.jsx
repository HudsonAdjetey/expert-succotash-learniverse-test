import "../styles/authStyles.css";
import "../styles/sign.css";

import { SignUp } from "./SignUp.2";

// Function to get step text based on step number
export const getStepText = (step) => {
  switch (step) {
    case 1:
      return "Basic Info";
    case 2:
      return "Parental Info";
    case 3:
      return "Class Info";
    case 4:
      return "Account Info";
    default:
      return "";
  }
};
export function getFileSizeInMb(file) {
  const fileSizeInByte = file?.size;
  const fileSizeInMb = fileSizeInByte / 1024 / 1024;
  return Math.round(fileSizeInMb * 100) / 100;
}
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
export default SignUp;
