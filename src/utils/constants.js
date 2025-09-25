export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://ielts-prep.onrender.com";
