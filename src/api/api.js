import axios from "axios";
import { getToken } from "./auth";

const Api = axios.create({
  // baseURL: `${window._env_.api}`
  baseURL: `http://159.223.120.194/api`
  //baseURL: `http://localhost:3000/api`
});

Api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;