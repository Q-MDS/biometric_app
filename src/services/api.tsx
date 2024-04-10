import axios from 'axios';

// const baseUrl = 'https://ap.aqordwellnessadmin.com';
const baseUrl = 'http://192.168.1.28/aqord-backend';

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
