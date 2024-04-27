import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../app/userSlice";
import Acc from "../../components/Account/Acc";
import { app } from "../../firebase";
import { URL, getFileSizeInMb, readFileAsBase64 } from "./Account";

export const Account = memo(() => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImageFile] = useState(null);
  const [imagePercent, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useSelector((state) => state.user);
  const [imageUpload, setImageUpload] = useState(null);
  const [startPasword, setStartPassword] = useState("");
  const [endPassword, setEndPassword] = useState("");

  const handleSetImage = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const ext = file["name"].split(".").pop();
      const extensions = ["JPG", "JPEG", "PNG", "jpeg", "jpg", "png"];
      if (!extensions.includes(ext)) {
        alert("Please upload a valid image file");
        setImageUpload(null);
        return;
      }
    }
    const sizeInMb = getFileSizeInMb(file);
    if (sizeInMb > 3) {
      alert("Please upload an image with size less than 3MB");
      setImageUpload(null);
      return;
    }
    const fileContent = await readFileAsBase64(file);
    setImageUpload(fileContent);
  };
  const [form, setForm] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    contact: user.contact,
    photoUrl: "",
    currentPassword: null,
    password: null,
  });

  const handleInputs = (e) => {
    switch (e.target.name) {
      case "currentPassword":
        setForm((prevForm) => ({
          ...prevForm,
          currentPassword: e.target.value,
        }));
        break;
      case "newPassword":
        setForm((prevForm) => ({ ...prevForm, password: e.target.value }));
        break;
      case "firstName":
        setForm((prevForm) => ({ ...prevForm, firstName: e.target.value }));
        break;
      case "lastName":
        setForm((prevForm) => ({ ...prevForm, lastName: e.target.value }));
        break;
      case "username":
        setForm((prevForm) => ({ ...prevForm, username: e.target.value }));
        break;
      case "email":
        setForm((prevForm) => ({ ...prevForm, email: e.target.value }));
        break;
      default:
        console.log("default");
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user.setUsername, user.setEmail]);

  const handleChange = useCallback((e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, []);

  const mutation = useMutation({
    mutationKey: "updateUser",
    mutationFn: (data) => {
      return axios.put(`${URL}/update`, data);
    },
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (form.currentPassword !== form.password) {
          alert("Current password is incorrect");
          return;
        }
        if (image) {
          const storage = getStorage(app);
          const fileName = new Date().getTime + image.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImagePercentage(Math.round(progress));
            },
            () => {
              setImageError(true);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const res = await mutation.mutateAsync({
                  ...form,
                  photoUrl: downloadURL,
                });
                dispatch(updateUser(res.data));
                console.log("Updated");
              } catch (error) {
                console.log(error);
              }
            }
          );
        } else {
          const res = await mutation.mutateAsync(form);
          dispatch(updateUser(res.data));
          console.log("Updated");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [form, image]
  );

  return (
    <section className="home ">
      <div className="content__whole">
        <Acc
          fullName={user.firstName + " " + user.lastName}
          username={form.username}
          firstName={form.firstName}
          lastName={form.lastName}
          contact={form.contact}
          email={form.email}
          currentPassword={startPasword}
          newPassword={endPassword}
          handleChange={(e) => handleChange(e)}
          profile={imageUpload || user.profile}
          handleSubmit={handleSubmit}
          handleInputs={handleInputs}
          setImage={(e) => handleSetImage(e)}
        />
      </div>
      <div>
        {imageError ? (
          <span className="er-up rg">Image Upload failed</span>
        ) : imagePercent > 0 && imagePercent < 100 ? (
          <span className="er-up ">{`Uploading: ${imagePercent} %`}</span>
        ) : imagePercent === 100 ? (
          <span className="er-up gr">Image uploaded successfully</span>
        ) : (
          ""
        )}
      </div>
    </section>
  );
});
