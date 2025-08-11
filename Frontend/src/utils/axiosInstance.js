import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api" || process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
