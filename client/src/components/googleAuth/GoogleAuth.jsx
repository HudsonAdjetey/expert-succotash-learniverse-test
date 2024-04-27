import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/userSlice";
import { FcGoogle } from "react-icons/fc";

const URL = `/api/auth`;

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationKey: "google_login",
    mutationFn: (data) => {
      return axios.post(`${URL}/google`, data);
    },
  });

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const resp = result._tokenResponse;
      const firstName = resp.firstName;
      const lastName = resp.lastName;
      const email = resp.email;
      const displayName = resp.displayName;
      const photoURL = resp.photoUrl;
      const fullName = resp.fullName;
      const res = await mutation.mutateAsync({
        username: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        photoUrl: photoURL,
        fullName: fullName,
      });

      const response = res.data.data;
      dispatch(setUser(response));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="googleBtn">
      <button onClick={handleGoogleClick}>
        <span>
          <FcGoogle />
        </span>
        <span>Continue with google</span>
      </button>
    </div>
  );
};

export default GoogleAuth;
