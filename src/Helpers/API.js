import axios from 'axios';

let baseURL =  'https://raccat-logbook.herokuapp.com/'

if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && false) {
  baseURL = 'http://127.0.0.1:8000/'
}

export default axios.create({
  baseURL: baseURL,
})
