import axios from 'axios'

const API_BASE = axios.create ( {
    baseURL: 'http://localhost:8000/api/',
    timeout: 5000,
})

export default API_BASE;