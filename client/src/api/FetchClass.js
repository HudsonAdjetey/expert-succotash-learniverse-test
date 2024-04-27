import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = `/api/course`;

let admissionSet;

export const allClass = async () => {
  try {
    const fetchClass = await axios.get(`${URL}/course-all`);
    const admission = fetchClass.data.admission;
    const monthFee = fetchClass.data.monthFee;
    return {
      data: fetchClass.data.data,
      admission: fetchClass.data.admission,
      monthFee: fetchClass.data.monthFee,
    };
  } catch (error) {
    console.log(error);
  }
};

export const dataFetch = admissionSet;
