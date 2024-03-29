/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientForm = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "/",
  headers: {
    "Content-Type": "multipart/form-data; boundary=something",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem("userInfo"))
      config.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem("userInfo")!).token
      }`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;
