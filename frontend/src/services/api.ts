import axios from "axios";
import { backendUrl } from "../config";

const api = axios.create({ baseURL: backendUrl, withCredentials: true });

export default api;
