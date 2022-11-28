import axios from "axios";
import apiConfig from "../config/api.config.js";

const instance = axios.create({
  baseURL: apiConfig.API_LOCATION,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
