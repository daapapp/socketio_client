import axios from 'axios';
import {getCookie} from "./cookie";
// const a = getCookie('token')
axios.defaults.baseURL=process.env.REACT_APP_BASE_API
// axios.defaults.headers={'cookie':'token='+getCookie('token')}
axios.defaults.withCredentials=true;
export {axios}
