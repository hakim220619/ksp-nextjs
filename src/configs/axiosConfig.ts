import axios from 'axios'

const axiosCons = axios.create({
  // .. congigure axios baseURL
  baseURL: `http://localhost:4000/api`
})
// console.log(axiosCons)
export default axiosCons
