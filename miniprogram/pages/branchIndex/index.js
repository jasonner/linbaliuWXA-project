// miniprogram/pages/index/index.js
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    step: 1, //滚动速度
    distance: 0, //初始滚动距离
    space: 30,
    interval: 20, // 时间间隔
    tipShow:true,
    timer1:null,
    yearDate:'',
    weekDate:'',
    w:'',
    totalAll:0,
    userInfoList:{},
    organization:'0',
    joinType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      joinType: options.joinType
    })
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(222)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(333)
    var that = this;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(function(res) {
      var length = res[0].width;
      var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
      console.log(windowWidth);
      console.log(that.data.interval);
      console.log(that.data.step);
      that.setData({
        length: length,
        windowWidth: windowWidth,
        space:windowWidth
      });
      that.scrollling(); // 第一个字消失后立即从右边出现
    });
    var isLogin = wx.getStorageSync('openid');
    if (isLogin) {
      var today=new Date();//获取当前时间
      var y = today.getFullYear();
      var m = today.getMonth()+1;
      var d = today.getDate();
      this.setData({
        yearDate:this.timeStrChange(new Date().getTime()),
        weekDate:this.getCurrentWeek(y,m,d)
      });
      this.getWeekTotalInfo(y,m,this.getCurrentWeek(y,m,d));
      this.getuserInfoChange();
			this.getMsgIitChange();
			this.sedMsg();
      wx.hideLoading();
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
	
	//消息授权推送
	sedMsg(){
    wx.requestSubscribeMessage({
      tmplIds: ['rQmfM4pIJgKCWCAL_VoFrJclXu90kxlWVEq6KR4PMBY','Det09jcj1MEofNFWa_ZHPDMUpyZTGlqPap3xBVf6DCM','OlaV0KWN7ngjzKXwP3NGOUYKOA4LMUl8A6VSBZmbv4k'],
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
	
  //获取温馨提示
  getMsgIitChange(){
    let that = this;
    hrp.getMsgIit().then((res) => {
        console.log(res.data);
        if (res.data.s) {
          that.setData({
            text:res.data.data.textcontent
          })
        }else{
        wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.data.msg
        })
        }
    })
  },

  //获取用户信息
  getuserInfoChange(){
    let that = this;
    var isLogin = wx.getStorageSync('openid');
    customer.getuserMsgInfo({ 
        'openid':isLogin,
    }).then((res) => {
        console.log(res.data);
        console.log('啊啊啊啊啊')
        if (res.data.s) {
          if(!res.data.data.email || res.data.data.email ==''){
            this.setEmail();
          };
          that.setData({
            userInfoList:res.data.data,
            organization:res.data.data.organization
          })
        }else{
        wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.data.msg
        })
        }
    })  
  },

  //自然周总提交数
  getWeekTotalInfo(){
    let that = this;
    var isLogin = wx.getStorageSync('openid');
    hrp.weekTotalInfo({ 
      'openid':isLogin,
      'status':'1',
      'year':new Date().getFullYear(),
      'month':(new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
      'week':that.data.w
    }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
            console.log(res.data.data.total)
            if(res.data.data.total && res.data.data.total!=''){ 
              that.setData({
                totalAll:res.data.data.total
              })
              console.log(res.data.data.total)
            }else{
              that.setData({
                totalAll:0
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
  scrollling: function() {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if(that.data.timer1){
      clearInterval(that.data.timer1);
    };
    that.data.timer1 = setInterval(function() {
      var maxscrollwidth = length + that.data.space;
      var left = that.data.distance;
      if (left < maxscrollwidth) { //判断是否滚动到最大宽度
        that.setData({
          distance: left + that.data.step
        })
      } else {
        that.setData({
          distance: 0 // 直接重新滚动
        });
        clearInterval(that.data.timer1);
        that.scrollling();
      }
    }, that.data.interval);
  },
  
  //信息录入
  addDetail(){
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['YOHHlDX3DxvtpeDqhNF4z-dkkvWScY_dXXTYsCAw6Qo','4WdND5gwZrgiq7YsEaNv1nxqZiHPQRmrHG2vvZ8ZVNM'],
      success (res) {
        console.log(res)
        res === {
           errMsg: "requestSubscribeMessage:ok",
           "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
        }
        if(res.errMsg =='requestSubscribeMessage:ok'){
          var isLogin = wx.getStorageSync('openid');
          if(that.data.organization =='0' || that.data.organization =='1'){
            wx.navigateTo({
              url: '/pages/addDetail/index?openid='+isLogin +'&organization='+that.data.organization+'&joinType='+that.data.joinType
            })
          }else {
            wx.navigateTo({
              url: '/pages/addDetail/index?openid='+isLogin +'&organization='+that.data.organization+'&joinType='+that.data.joinType
            })
          }
          
        }else{
            wx.showModal({
                title: '提示',
                content: '订阅取消',
                showCancel:false
            })
        };
      }
    })
  },
  handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
  },

  lookRecord(){
    wx.navigateTo({
        url: '/pages/record/index'
      })
  },

  lookUsercenter(){
    wx.switchTab({
      url: '../userCenter/index',
    })
  },

  tipCloseChange(){
    this.setData({
      tipShow:false
    })
  },
  lookTipChange(){
    let that = this;
    console.log(that);
    wx.showModal({
      title: '提示',
      content: that.data.text,
      showCancel:false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //获取当前周
  getCurrentWeek(a,b,c){
    console.log(a+"年")
    console.log(b+"月")
    console.log(c+"日")
    var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate(); 
    var week = Math.ceil((d + 6 - w) / 7);
    console.log(week);
    this.setData({
      w:week
    });
    switch (week) {
      case 1:
        week = '一'
        break;
      case 2:
        week = '二'
        break;
      case 3:
        week = '三'
        break;
      case 4:
        week = '四'
        break;
      case 5:
        week = '五'
        break;
      default:
        break;
    }
    return week; 
  },
    
  //时间戳转日期
  timeStrChange(data){
    var date = new Date(data)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    return Y + M + D
  },
  //设置邮箱
  setEmail(){
    let that  = this;
    wx.showModal({
        title: '设置邮箱',
        editable:true,
        placeholderText:'请输入邮箱',
        success (res) {
            if (res.confirm) {
                console.log(res);
                if(res.content ==''){
                    wx.showToast({
                        title: '请输入邮箱',
                        icon: 'error',
                        duration: 2000
                    })
                }else if(!that.emailVerify(res.content)){
                    wx.showToast({
                        title: '邮箱不正确',
                        icon: 'error',
                        duration: 2000
                    })
                }else{
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
  emailVerify(email){
      //var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(reg.test(email)){
          return true
      }else{
          return false
      }
  },

  //提交邮箱
  setImailChange(value){
      let that = this;
      var isLogin = wx.getStorageSync('openid');
      hrp.setEmail({ 
          'openid':isLogin,
          'value':value,
      }).then((res) => {
          console.log(res.data);
          if (res.data.s) {
              if(res.data.s){ 
                  wx.showToast({
                      title: '成功',
                      icon: 'success',
                      duration: 2000
                  })
                  that.getuserInfoChange();
              }else{
                  wx.showToast({
                      title: res.data.msg,
                      icon: 'error',
                      duration: 2000
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