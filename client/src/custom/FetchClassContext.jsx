import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { allClasses } from "../app/userSlice";

const ClassFetch = createContext();

export const ClassFetchContext = () => {
  return useContext(ClassFetch);
};

export const ClassFetchProvider = ({ children }) => {
  const [listData, setListData] = useState();
  const dispatch = useDispatch();
  // Get all classes for the class list.
  const queryHook = useQuery({
    queryKey: ["all-classes"],
    queryFn: () => {
      return axios.get(`${URL}course-all`);
    },
  });

  useEffect(() => {
    if (queryHook.isSuccess) {
      const data = queryHook?.data?.data?.admission;

      // Create a new array by adding an index to each element
      dispatch(allClasses(data));
      // Update listData state with the modified array
      setListData(data);
    }
  }, [queryHook]);

  return (
    <ClassFetch.Provider value={{ listData }}>{children}</ClassFetch.Provider>
  );
};

// Do I use queryHook.queryAsync to fetch data in an async?
