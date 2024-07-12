import axios from 'axios'

const axiosCons = axios.create({
  baseURL: `http://localhost:4000/api`
  // baseURL: `https://kspapi.sppapp.com/api`
})
export default axiosCons
