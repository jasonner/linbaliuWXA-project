// pages/guildMenu1/index.js
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
      iconSrc: 'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/UseGuide/icon-1.png',
      title: '送检',
      content: '全面的送检流程',
      btnText: '进入'
    }, {
      iconSrc: 'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/UseGuide/icon-2.png',
      title: '查询并下载检测报告',
      content: '一键操作方便快捷',
      btnText: '进入'
    }, {
      iconSrc: 'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/UseGuide/icon-3.png',
      title: '知情同意书下载',
      content: '发邮箱更快捷',
      btnText: '查看'
    }, {
      iconSrc: 'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/UseGuide/icon-4.png',
      title: '送检样本要求',
      content: '图片预览，简单明了',
      btnText: '查看'
    }, {
      iconSrc: 'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/UseGuide/icon-5.png',
      title: 'Q&A',
      content: '问答全面了解',
      btnText: '查看'
    }],
    email:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
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

  },

  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  lookDetail(e) {
    let that = this;
    switch (e.currentTarget.dataset.index) {
      case 1:
        wx.navigateTo({
          url: '/pages/guildSongjianList/index?id=' + e.currentTarget.dataset.index,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/systemSelection/index?id=' + e.currentTarget.dataset.index,
        })
        break;
      case 3:
        that.getuserInfoChange();
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/collectInformation/index?id=' + e.currentTarget.dataset.index,
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/qAndA/index?id=' + e.currentTarget.dataset.index,
        })
        break;
      default:
        break;
    }
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
            if(res.data.data && res.data.data!=''){ 
              if(res.data.data.email){
                that.setData({
                  email:res.data.data.email
                })
                that.SendTongyishuChange();
              }else{
                that.setEmail();
              }
              console.log(that.data.email)
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


  //发送知情同意书
  SendTongyishuChange(){
    let that = this;
    hrp.SendTongyishu({
      'email': that.data.email,
    }).then((res) => {
      console.log(res.data);
      if (res.data.s) {
        if (res.data.s) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.msg
        })
      }
    })
  },

  //设置邮箱
  setEmail() {
    let that = this;
    wx.showModal({
      title: '设置邮箱',
      editable: true,
      placeholderText: '请输入邮箱',
      success(res) {
        if (res.confirm) {
          console.log(res);
          if (res.content == '') {
            wx.showToast({
              title: '请输入邮箱',
              icon: 'error',
              duration: 2000
            })
          } else if (!that.emailVerify(res.content)) {
            wx.showToast({
              title: '邮箱不正确',
              icon: 'error',
              duration: 2000
            })
          } else {
            that.setImailChange(res.content);
          }
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //邮箱格式验证
  emailVerify(email) {
    //var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
      return true
    } else {
      return false
    }
  },

  //提交邮箱
  setImailChange(value) {
    let that = this;
    hrp.setEmail({
      'openid': that.data.openid,
      'value': value,
    }).then((res) => {
      console.log(res.data);
      if (res.data.s) {
        if (res.data.s) {
          that.getuserInfoChange();
          that.SendTongyishuChange();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
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
 
})