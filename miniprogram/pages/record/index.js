// miniprogram/pages/record/index.js
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:'',//空值：全部 ；0：草稿 ； 1：已确认
    page:1,
    size:20,
    total:0,
    recordList:[],
    userInfoList:{},
    yearDate:'',
    weekDate:'',
    w:'',
    totalAll:0,
    scrollTop: 0,
    scrollHeight:0,
    hidden:true, //加载图标是否显示
    hasSubmitNum:false//草稿箱未提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.info(res.windowHeight/1.2);
        that.setData({
          scrollHeight: res.windowHeight/1.2
        });
      }
    });  
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
    this.getmsgList();
    this.getuserInfoChange();
    var today=new Date();//获取当前时间
    var y = today.getFullYear();
    var m = today.getMonth();
    var d = today.getDate();
    this.setData({
      yearDate:this.timeStrChange(new Date().getTime()),
      weekDate:this.getCurrentWeek(y,m,d)
    });
    this.getWeekTotalInfo();
  },
  
  goback(){
      wx.navigateBack({
        delta: 0,
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
        if (res.data.s) {
            if(res.data.data && res.data.data!=''){ 
                that.setData({
                  userInfoList:res.data.data
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
  tabClick:function(e){
    this.setData({
      _num:e.currentTarget.dataset.index
    })
    this.getmsgList();
  },
  lookDetail(e){
    console.log(e.currentTarget.dataset.organization);
    if(e.currentTarget.dataset.status === 0){//未提交
      var isLogin = wx.getStorageSync('openid');
      console.log(isLogin)
      wx.navigateTo({
        url: '../addDetail/index?id='+e.currentTarget.dataset.index+'&openid='+isLogin+'&organization='+e.currentTarget.dataset.organization,
      });
    }else{
      wx.navigateTo({
        url: '../data1/index?id='+e.currentTarget.dataset.index + '&organization='+e.currentTarget.dataset.organization,
      });
    }
  },
  //获取检测数据样本信息
  getmsgList(){
    let that = this;
    var isLogin = wx.getStorageSync('openid');
    hrp.GetInfoList({ 
      'openid':isLogin,
      'status':that.data._num,
    }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
            if(res.data.data && res.data.data.length>0){ 
              res.data.data.forEach(element => {
                if(element.write){
                  element.write = that.timeStrChange(element.write*1);
                }else{
                  element.write = element.c_time.substr(0, element.c_time.indexOf(" "));
                };
                if(element.status ===0){
                  that.setData({
                    hasSubmitNum:true
                  })
                }
              });
              that.setData({
                recordList:res.data.data,
                total:res.data.data.length
              })
            }else{
              that.setData({
                recordList:[],
                total:0
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
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  // 分页处理
  bindDownLoad: function () {
    var that = this;
    console.log('页面滑倒底部')
    //页面滑动到底部的事件  
    console.log(that.data.total);
    console.log(that.data.size);
    if (that.data.total < that.data.size){
      wx.showModal({
        title: '提示',
        content: '已经没有更多数据了',
        showCancel:false,
      })
    }else{
      that.setData({
        size:that.data.size+=5
      })
      that.getmsgList()
    }
  },  
  // 页面滚动监听
  scroll: function (event) {
    //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。  
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  //获取当前周
  getCurrentWeek(a,b,c){
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
            if(res.data.data && res.data.data!=''){ 
              that.setData({
                totalAll:res.data.data.total
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