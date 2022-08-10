import http from '../utils/http.js'
import config from'../env/config.js'

const URL = config.hrp_server_url
module.exports = {
    // application/x-www-form-urlencoded
    //设置邮箱
    setEmail:(params) => http.post(URL + '/api/NHL/UpdateEmail', { data: params, header: { 
      "Content-Type": "application/json;charset=UTF-8"}}), 
    
    //添加信息
    addMsg:(params) => http.post(URL + '/api/NHL/CreateInfo', { data: params, header: { 
      "Content-Type": "application/json;charset=UTF-8"}}), 

    //根据id查询单条数据样本信息 （睿昂）
    GetDeceteInfoById: (params) => http.get(URL + '/api/NHL/GetDeceteInfoById', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //根据id查询单条数据样本信息  （金橡）//TODO
    GetInfoDetailsById: (params) => http.get(URL + '/api/NHL/GetInfoDetailsByIdV3', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //获取用户送检数据样本信息
    GetInfoList: (params) => http.get(URL + '/api/NHL/GetInfoListV3', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //修改检测数据
    upDetectInfo:(params) => http.post(URL + '/api/NHL/UpdateInfo', { data: params, header: { 
      "Content-Type": "application/json;charset=UTF-8"}}), 

    //获取项目进度的检测数据列表  //TODO V2
    getlistDetectList: (params) => http.get(URL + '/api/NHL/GetDeceteList', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),
    
    //根据formid查询检测信息
    GetDetectByFromid: (params) => http.get(URL + '/api/NHL/GetDetectByFromid', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}), 

    //查询跟进信息
    getQueryfollowInfo: (params) => http.get(URL + '/api/NHL/GetFollowByFormId', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),
    
    //修改或新增 跟进信息
    updatefollowInfo:(params) => http.post(URL + '/api/NHL/updateFollw', { data: params, header: { 
      "Content-Type": "application/json;charset=UTF-8"}}), 

    //获取自然周总提交数量
    weekTotalInfo:(params) => http.get(URL + '/api/NHL/GetInfoTotalV3', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //总提交量
    AllInfoChart:(params) => http.get(URL + '/api/NHL/GetInfoChartV3', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //模糊查询送检单位
    getUnitSearch:(params) => http.get(URL + '/api/NHL/GetUnit', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),
    
    //查询BTK治疗
    getBtkChart:(params) => http.get(URL + '/api/NHL/GetBtkChart', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),
    
    //温馨提示
    getMsgIit:(params) => http.get(URL + '/api/NHL/GetHint', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),  
      
    //根据formid发送报告到邮箱
    sendReportEmail:(params) => http.get(URL + '/api/NHL/sendReportEmail', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 
    
    //取消订单 //TODO V2
    CancelOrder:(params) => http.get(URL + '/api/NHL/CancelOrder', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 

    //发送知情同意书到邮箱
    SendTongyishu:(params) => http.get(URL + '/api/NHL/SendTongyishu', { data: params, header: {"Content-Type": "application/json;charset=UTF-8"}}), 
    
}