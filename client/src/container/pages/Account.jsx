import { Account } from "./Account.1";
export const URL = `/api/auth`;

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

export default Account;
