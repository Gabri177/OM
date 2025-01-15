import axios from 'axios';
import { getToken, isTokenExpired, removeToken } from '~/composables/auth.js';
import * as constants from '~/constants';
import { useRouter } from 'vue-router'
import { toast } from '~/composables/util'


const router = useRouter();
const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
console.log("axios.js apiBaseURL: ", apiBaseURL)
const service = axios.create({
  baseURL: apiBaseURL + '/api',
  // headers: {
  // 	'Content-Type': 'application/x-www-form-urlencoded',
  // }
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = getToken();
  console.log("axios.js token antes de enviar: ", token)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
    config.headers[constants.COOKIE_SET.token_name] = token;
    console.log("axios.js token: ", token)
  }
  // if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded' && config.data) {
  // 	// 将数据序列化为 x-www-form-urlencoded 格式
  // 	config.data = qs.stringify(config.data); 
  // 	console.log("axios.js 序列化后的数据: ", config.data)
  // }
  if (isTokenExpired()) {
    toast('警告', '登录已过期, 请重新登陆!', 'warning')
    removeToken()
    router.push('/')
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  console.log('返回数据:  ', response.data.data)
  return response.data.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});


export default service;