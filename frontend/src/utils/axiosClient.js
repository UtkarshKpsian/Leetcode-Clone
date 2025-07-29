import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://leetcode-clone1.onrender.com",  // your render backend URL here
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});


