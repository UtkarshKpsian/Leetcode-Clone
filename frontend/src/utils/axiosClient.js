import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://leetcode-clone1.onrender.com",
  withCredentials: true, // ✅ this is crucial for cookies (token)
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosClient;


