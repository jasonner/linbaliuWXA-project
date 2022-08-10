// pages/branch/index.js
const customer = require('../../api/customer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoList:{},
    organization:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  ceo2Change(){
    if(this.data.organization =='0' || this.data.organization =='1' || this.data.organization =='0,1'){//G-02不可选,可提交
      wx.showModal({
        title: '提示',
        showCancel:false,
        content:'您不能填写此项检测'
      })
    }else{
      wx.reLaunch({
        url: '../branchIndex/index?joinType=CE02',
      })
    }
  },

  BChange(){
    if(this.data.organization =='2'){//B+不可进入
      wx.showModal({
        title: '提示',
        showCancel:false,
        content:'您不能填写此项检测'
      })
    }else{
      wx.reLaunch({
        url: '../branchIndex/index?joinType=B',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var isLogin = wx.getStorageSync('openid');
    if (isLogin) {
      this.getuserInfoChange()
      return
    }else{
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      wx.redirectTo({
        url: '../login/index',
      })
    };
    
  },
  //获取用户信息
  getuserInfoChange(){
    let that = this;
    var isLogin = wx.getStorageSync('openid');
    customer.getuserMsgInfo({ 
        'openid':isLogin,
    }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
          that.setData({
            userInfoList:res.data.data,
            organization:res.data.data.organization
          })
          if(res.data.data.organization =='3'){//天晴直接进入
            wx.switchTab({
              url: '../branchIndex/index?joinType=tianQ',
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
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '淋巴瘤精准筛查公益信息交互平台',
      path:'/pages/index/index',
      // imageUrl:'https://forhoooss.wfbweb.com/2022/wj/jihu0610/share/shareW.jpg'
    }
  },
  onShareTimeline(item) {
    return {
      title: '淋巴瘤精准筛查公益信息交互平台',
      path:'/pages/index/index',
      // imageUrl:'https://forhoooss.wfbweb.com/2022/wj/jihu0610/share/shareW.jpg'
    }
  }
})