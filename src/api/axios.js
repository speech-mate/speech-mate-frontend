import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": process.env.REACT_APP_BASE_URL,
  },
  withCredentials: true,
});
