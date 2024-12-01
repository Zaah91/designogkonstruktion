import axios from "axios";

// Definer en instans af axios som vi kan genbruge i hele vores projekt
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // Brug vores miljøvariable fra .env filen
});

export default axiosInstance;