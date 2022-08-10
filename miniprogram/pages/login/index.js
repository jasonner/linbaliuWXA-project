// pages/login/index.js
const customer = require('../../api/customer.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userTel:'',
    loginDisabled:false,
    openid:null,
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isLogin = wx.getStorageSync('openid');
    if (isLogin) {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
  },
  getUserProfile(e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        if(res.userInfo){
          app.globalData.userInfo =  res.userInfo;
          that.loginChange();
        };
      }
    });
  },

  getUserName(e){
    this.data.userName = e.detail.value;
  },

  getUserTel(e){
    this.data.userTel = e.detail.value;
  },

  loginChange(){
    let that  = this;
    that.setData({
      loginDisabled:true
    })
    setTimeout(() => {
      that.setData({
        loginDisabled:false
      })
    }, 5000);
    wx.login({
      timeout:5000,
      success: (result) => {
        console.log(result);
        customer.getOpenid({ 
          'jscode':result.code,
        }).then((res) => {
          console.log(res.data);
            res.data.data = JSON.parse(res.data.data);
            console.log(res.data);
            if (res.data.s) {
                if(res.data.data.openid){ 
                  that.setData({
                    openid:res.data.data.openid
                  })
                  wx.setStorageSync('openid',res.data.data.openid);
                  that.loginInfo();
                }else{
                  wx.showModal({
                    title: '提示',
                    showCancel:false,
                    content: res.data.msg
                  })
                }
            }else{
              wx.showModal({
                title: '提示',
                showCancel:false,
                content: res.data.msg
              })
            }
        })        
      }
    })
  },
  
  //消息推送
  sedMsg(){
    console.log('消息推送')
    wx.requestSubscribeMessage({
      tmplIds: ['YOHHlDX3DxvtpeDqhNF4z-dkkvWScY_dXXTYsCAw6Qo','4WdND5gwZrgiq7YsEaNv1nxqZiHPQRmrHG2vvZ8ZVNM'],
      success (res) {
        console.log(res)
        res === {
           errMsg: "requestSubscribeMessage:ok",
           "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
        }
        if(res.errMsg =='requestSubscribeMessage:ok'){
            wx.showModal({
                title: '提示',
                content: '预约成功',
                showCancel:false
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '预约失败',
                showCancel:false
            })
        }
      }
    })
  },

  //上传更新昵称和头像
  upUserMsgChange(){  
    console.log('上传头像')
    let that = this;
    customer.upUserMsg({ 
      'openid':that.data.openid,
      'nickname':app.globalData.userInfo.nickName,
      'headimg':app.globalData.userInfo.avatarUrl,
    }).then((res) => {
        console.log(res);
        if (res.statusCode && res.statusCode== '200') {
            if(res.data.s){
              that.getuserInfoChange();
            }
        }else{
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.data.msg
          })
        }
    })  
  },

  loginInfo(){
    console.log(this.data.userName);
    if(this.data.userName ==''){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请输入姓名'
      })
    }else if(this.data.userTel ==''){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请输入电话'
      })
    }else{
      let that = this;
      customer.bindLogin({ 
        'openid':that.data.openid,
        'phone':that.data.userTel,
        'name':that.data.userName,
      }).then((res) => {
          if (res.statusCode && res.statusCode== '200') {
              if(res.data.s && res.data.data){ 
                that.upUserMsgChange();
              }else{
                wx.showModal({
                  title: '提示',
                  showCancel:false,
                  content: res.data.msg
                })
              }
          }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: res.data.msg
            })
          }
      })  
    }
  },

   //获取用户信息
  getuserInfoChange(){
    let that = this;
    customer.getuserMsgInfo({ 
        'openid':that.data.openid,
    }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
          that.setData({
            userInfoList:res.data.data,
            organization:res.data.data.organization
          })
          if(res.data.data.organization =='2'){
            wx.switchTab({
              url: '../branchIndex/index?joinType=CE02',
            })
          }else{
            wx.redirectTo({
              url: '../index/index',
            })
          }
        }else{
          wx.showModal({
              title: '提示',
              showCancel:false,
              content: res.data.msg
          })
        }
    })  
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})