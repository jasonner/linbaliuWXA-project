// miniprogram/pages/msgList/index.js
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:'0',
    text: "",
    step: 1, //滚动速度
    distance: 0, //初始滚动距离
    space: 30,
    interval: 20, // 时间间隔
    tipShow:true,
    timer1:null,
    page:1,
    size:20,
    total:0,
    recordList:[],
    yearDate:'',
    weekDate:'',
    w:'',
    totalAll:0,
    userInfoList:{},
    scrollTop: 0,
    scrollHeight:0,
    hidden:true, //加载图标是否显示
		email:'',
    hasSubmitNum:false,//后续跟进没有提交
    organization:'0' 
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
    var that = this;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(function(res) {
      var length = res[0].width;
      var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
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
      this.getmsgList();
      this.getMsgIitChange();
    }else{
      wx.redirectTo({
        url: '../login/index',
      })
    }
   
  },

  handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
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
      if (res.data.s) {
        if(res.data.data && res.data.data!=''){ 
            that.setData({
              userInfoList:res.data.data,
              email:res.data.data.email,
              organization:res.data.data.organization
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

  tabClick:function(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      _num:e.currentTarget.dataset.index
    });
    this.getmsgList();
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

  lookDetail(e){
    console.log(this.data._num+'哈哈哈哈');
    if(this.data._num =='0'){
      wx.navigateTo({
        url: '../data1/index?id='+e.currentTarget.dataset.index+'&organization='+this.data.organization,
      })
    }else if(this.data._num =='1'){
      wx.navigateTo({
        url: '../data2/index?id='+e.currentTarget.dataset.index+'&organization='+this.data.organization,
      })
    }else if(this.data._num =='2'){
      var isLogin = wx.getStorageSync('openid');
      wx.navigateTo({
        url: '../recordDetail/index?openid='+isLogin+'&id='+e.currentTarget.dataset.index,
      })
    }
  },

  //重新提交
  reSubmitDetail(e){
    var isLogin = wx.getStorageSync('openid');
    console.log(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../editRecordDetail/index?openid='+isLogin+'&id='+e.currentTarget.dataset.index,
    })
  },

  //取消订单
  delOrder(e){
    let that = this;
    console.log(e.currentTarget.dataset.index);
    if(e.currentTarget.dataset.index){
      hrp.CancelOrder({ 
        // 'openid':isLogin,
        'formid':e.currentTarget.dataset.index,
      }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.data.msg
          });
          that.getmsgList();
        }else{
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: res.data.msg
          })
        }
      })  
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: 'formid为空,请核对后重新取消订单'
      })
    }
    
  },

  //获取检测列表
  getmsgList(){
    let that = this;
    var isLogin = wx.getStorageSync('openid');
    if(that.data._num =='2'){
      var detect = '1'
    }else{
      var detect = that.data._num;
    }
    hrp.getlistDetectList({ 
      'openid':isLogin,
      'detect':detect,
      'page':that.data.page,
      'size':that.data.size
    }).then((res) => {
        console.log(res.data);
        if (res.data.s) {
            if(res.data.data && res.data.data.length>0){ 
              res.data.data.forEach(element => {
                if(!element.detectcode || element.detectcode == 'null'){
                  element.detectcode = '--';
                };
                if(element.write){
                  element.write = that.timeStrChange(element.write*1);
                }else{
                  element.write = element.c_time.substr(0, element.c_time.indexOf(" "));
                }
                if(!element.IsFollow){
                  that.setData({
                    hasSubmitNum:true,
                  })
                }
              });
              that.setData({
                recordList:res.data.data,
                total:res.data.data.length
              })
            }else{ //TODO
              that.setData({
                recordList:[]
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

  //邮件发送数据报告
  sedEmailChange(e){
    console.log(this.data.email);
    console.log(e.currentTarget.dataset.formid);
    let that = this;
    hrp.sendReportEmail({
      formid:e.currentTarget.dataset.formid
    }).then((res) => {
        console.log(res.data);
        if(res.data.s) {
          wx.showModal({
            title: '提示',
            showCancel:false,
            content:'数据报告已发送至您的邮箱中，请查看'
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

  //自然周总提交数
  getWeekTotalInfo(y,m,w){
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

  //获取当前周
  getCurrentWeek(a,b,c){
    var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate(); 
    var week = Math.ceil((d + 6 - w) / 7);
    console.log(week)
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