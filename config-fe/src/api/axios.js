import axios from "axios";
import * as qs from "qs";
import { PathLike } from "fs";

let API_URL = process.env.API_URL || "http://localhost:5050";

const apiConfig = {
  returnRejectedPromiseOnError: true,
  withCredentials: true,
  timeout: 30000,
  baseURL: API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    "Access-Control-Allow-Origin": "*"
  },
  paramsSerializer: (params: PathLike) =>
    qs.stringify(params, { indices: false })
};

const instance = axios.create(apiConfig);

export default instance;
