var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;
var pieChart = null;
var column2Chart = null;
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
var chartData = {
    main: {
        title: '总成交量',
        dataOne: [],
        dataTow: [],
        itemStyle:{
            normal:{
                color:function(params){
                    let colorList = ['red','blue','green','gray','yellow','yellow','black'];
                    return colorList[params.dataIndex]
                }
            }
        },
        categories: [],
        toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['11', '22']
        },
        date:'2022'
    },
};
var chartData2 = {
    main: {
        dataYes: [0],
        dataNo: [0],
        categories: [' ', ' '],
        toolbox: {
            feature: {
              dataView: { show: false, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
        },
    },
};
Page({
    data: {
        chartTitle: '总成交量',
        isMainChartDisplay: true,
        text: "温馨提示：本周需要提交30份数据报告请按时完成数据报告",
        step: 1, //滚动速度
        distance: 0, //初始滚动距离
        space: 30,
        interval: 20, // 时间间隔
        tipShow:true,
        timer1:null,
        openid:null,
        avatarUrl:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/index/userHeader.png',
        nickName:'NIK豆豆',
        yearDate:'',
        weekDate:'',
        w:'',
        userInfoList:{},
        totalAll:0,
        allNumber:0,
        yearDateShow:'2022',
        noDataShow:false,
        columnNoDataShow:false
    },
    backToMainChart: function () {
        this.setData({
            chartTitle: chartData.main.title,
            isMainChartDisplay: true
        });
        columnChart.updateData({
            categories: chartData.main.categories,
            series: [{
                name: '成交量',
                data: chartData.main.data,
                format: function (val, name) {
                    return parseInt(val);
                }
            }]
        });
        column2Chart.updateData({
            categories: chartData2.main.categories,
            series: [{
                name: '成交量',
                data: chartData2.main.data,
                format: function (val, name) {
                    return parseInt(val);
                }
            }]
        });
    },
    touchHandler: function (e) {
        var index = columnChart.getCurrentDataIndex(e);
        if (index > -1 && index < chartData.sub.length && this.data.isMainChartDisplay) {
            this.setData({
                chartTitle: chartData.sub[index].title,
                isMainChartDisplay: false
            });
            columnChart.updateData({
                categories: chartData.sub[index].categories,
                series: [{
                    name: '成交量',
                    data: chartData.sub[index].data,
                    format: function (val, name) {
                        return parseInt(val);
                    }
                }]
            });

        }
    },
    onReady: function (e) {
        
        // this.columnChart1Change();
        this.columnChart2Change();
        //饼图
        // pieChart = new wxCharts({
        //     animation: true,
        //     canvasId: 'pieCanvas',
        //     type: 'pie',
        //     hoverAnimation:false,
        //     series: [{
        //         name: '数据1',
        //         data: 98,
        //         color:'#ffea5b',
        //     }, {
        //         name: '数据2',
        //         data: 95,
        //         color:'#f57dcf',
        //     }, {
        //         name: '数据3',
        //         data: 78,
        //         color:'#967df3',
        //     }, {
        //         name: '数据4',
        //         data: 45,
        //         color:'#2bd2d2',
        //     }, {
        //         name: '数据5',
        //         data: 45,
        //         color:'#68aafd',
        //     }, {
        //         name: '数据6',
        //         data: 78,
        //         color:'#8bce5d',
        //     }],
        //     width: windowWidth,
        //     height: 300,
        //     dataLabel: true,
        // });

       

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('测试1');
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
            this.setData({
                openid:isLogin
            });
            this.getUsrMsg();
            this.getBtkChartList();
            this.getuserInfoChange();
            this.getAllInfoChart();
            this.getMsgIitChange();
            var today=new Date();//获取当前时间
            var y = today.getFullYear();
            var m = today.getMonth()+1;
            var d = today.getDate();
            this.setData({
                yearDate:this.timeStrChange(new Date().getTime()),
                weekDate:this.getCurrentWeek(y,m,d),
                yearDateShow:new Date().getFullYear()
            });
            this.getWeekTotalInfo(y,m,this.getCurrentWeek(y,m,d));
            return
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

    //获取用户昵称和头像
    getUsrMsg(){
        this.setData({
            avatarUrl:wx.getStorageSync('avatarUrl'),
            nickName:wx.getStorageSync('nickName')
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

    //获取总提交量
    getAllInfoChart(){
        let that = this;
        var isLogin = wx.getStorageSync('openid');
        hrp.AllInfoChart({ 
            'openid':isLogin,
            'year':that.data.yearDateShow
        }).then((res) => {
            console.log(res.data);
            if (res.data.s) {
                if(res.data.data && res.data.data!=''){ 
                    that.setData({
                        totalAll:res.data.data.total
                    })
                    var all = 0;
                    if(res.data.data.detect && res.data.data.detect.length>0){
                        chartData.main.dataTow = [];
                        chartData.main.categories = [];
                        res.data.data.detect.forEach(element => {
                            chartData.main.dataTow.push(element.total);
                            chartData.main.categories.push(element.month+'月');
                        });
                    }else{
                        chartData.main.dataTow = [];
                    }
                    if(res.data.data.submit && res.data.data.submit.length>0){
                        chartData.main.dataOne = [];
                        res.data.data.submit.forEach(element => {
                            chartData.main.dataOne.push(element.total);
                            all+=element.total
                        });
                    }else{
                        chartData.main.dataOne = [];
                    }
                    console.log(all)
                    if(all >0){
                       that.setData({
                        columnNoDataShow:false
                       }) 
                    }else{
                        that.setData({
                            columnNoDataShow:true 
                        }) 
                    }
                    that.columnChart1Change();
                    that.setData({
                        allNumber:all
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
    //数表1
    columnChart1Change(){
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        //柱状图1
        columnChart = new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            animation: true,
            categories: chartData.main.categories,
            series: [{
                name: '已提交检测',
                type: 'bar',
                color:'#2fc0c5',
                format: function (val, name) {
                    return parseInt(val) ;
                },
                data: chartData.main.dataOne,
            },{
                name: '已完成检测',
                type: 'bar',
                color:'#f79080',
                format: function (val, name) {
                    return parseInt(val) ;
                }, 
                data: chartData.main.dataTow,
            }],
            yAxis: {
                format: function (val) {
                    return val;
                },
                title: '',
                min: 0
            },
            xAxis: {
                disableGrid: true,
                type: 'calibration'
            },
            extra: {
                column: {
                    width: 15
                }
            },
            width: windowWidth,
            height: 200,
        });
    },

    //数表2
    columnChart2Change(){
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        //柱状图2
        column2Chart = new wxCharts({
            canvasId: 'column2Canvas',
            type: 'column',
            animation: true,
            categories: chartData2.main.categories,
            series: [{
                name: '否',
                type: 'bar',
                color:'#7f4311',
                format: function (val, name) {
                    return parseInt(val) ;
                },
                data:chartData2.main.dataNo,
            },{
                name: '是',
                type: 'bar',
                color:'#2fc0c5',
                format: function (val, name) {
                    return parseInt(val);
                },
                data:chartData2.main.dataYes,
            }],
            yAxis: {
                format: function (val) {
                    return val;
                },
                title: '',
                min: 0
            },
            xAxis: {
                disableGrid: false,
                type: 'calibration'
            },
            extra: {
                column: {
                    width: 25
                },
                
            },
            width: windowWidth,
            height: 200,
        });
    },
    //获取Btk
    getBtkChartList(){
        let that = this;
        var isLogin = wx.getStorageSync('openid');
        hrp.getBtkChart({ 
            'openid':isLogin,
            'year':new Date().getFullYear()
        }).then((res) => {
            console.log(res.data);
            if (res.data.s) {
                //chartData
                if(res.data.data.yes !='0'  || res.data.data.no !='0'){
                    if(res.data.data.yes!=''){
                        chartData2.main.dataYes= [res.data.data.yes,'0']
                    }
                    if(res.data.data.no !==''){
                        chartData2.main.dataNo= ['0',res.data.data.no];
                    }
                    that.setData({
                        noDataShow:false
                    });
                    that.columnChart2Change();
                }else{
                    that.setData({
                        noDataShow:true
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
        hrp.setEmail({ 
            'openid':that.data.openid,
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

    //设置用户昵称
    setUserName(){
        let that  = this;
        wx.showModal({
            title: '设置昵称',
            editable:true,
            placeholderText:'请输入昵称',
            success (res) {
                if (res.confirm) {
                    console.log(res);
                    if(res.content ==''){
                        wx.showToast({
                            title: '请输入昵称',
                            icon: 'error',
                            duration: 2000
                        })
                    }else{
                        that.setUserNameSure(res.content);
                    }
                    console.log('用户点击确定')
                } else if (res.cancel) {
                console.log('用户点击取消')
                }
            }
        })
    },

    //确认修改昵称
    setUserNameSure(value){
        let that = this;
        customer.upUserMsg({ 
            'openid':that.data.openid,
            'nickname':value,
        }).then((res) => {
            console.log(res.data);
            if(res.data.s){ 
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                });
                wx.setStorageSync('nickName', value);
                that.getuserInfoChange();
            }else{
                wx.showToast({
                    title: res.data.msg,
                    icon: 'error',
                    duration: 2000
                })
            }
        }) 
    },
    
    //年份筛选
    bindDateChange(e){
        console.log(e.detail.value)
        this.setData({
            yearDateShow: e.detail.value
        });
        this.getAllInfoChart();
    },
     /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
     
    },
});