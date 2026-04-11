import axios from "axios";

/**
 * Single Axios instance; baseURL can point to a real backend later.
 * Mock layer intercepts via short delays in formApi service functions.
 */
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
