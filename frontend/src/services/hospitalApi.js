
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8080/api"
    : "/api");

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export async function getHospitals() {
  const response = await api.get("/hospitals");

  return response.data;
}

export async function getHospitalHistory(name) {
  const response = await api.get(
    "/hospitals/history",
    {
      params: { name },
    }
  );

  return response.data;
}
