import axios from 'axios';

const apiClient = axios.create({
  baseURL: `https://smashapartments.com`, // Dynamic base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;