import http from '../utils/http.js'
import config from'../env/config.js'

const URL = config.customer_server_url

module.exports = {

  //获取用户openid
  getOpenid:(params) => http.post(URL + '/api/NHL/getOpenId', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 

  //白名单登录
  bindLogin:(params) => http.post(URL + '/api/NHL/login', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 

  //获取用户信息
  getuserMsgInfo:(params) => http.get(URL + '/api/NHL/GetUserInfo', { data: params, header: {'content-type': 'application/json;charset=UTF-8' } }),

  //修改用户 昵称 头像
  upUserMsg:(params) => http.post(URL + '/api/NHL/UpdateUserNicknameAndHeadimg', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 

  

}