// pages/webView/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        href:'',
        openid:'',
        id:'',
        joinType:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            id:options.id,
            openid:options.openid,
            joinType:options.joinType
        });
        console.log(typeof options.organization)
        if(options.organization =='1' || options.organization =='0,1'){
          if(options.id){
            this.setData({
                  href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/recordList?v=202207281039&openid='+options.openid+'&id='+options.id+'&organization='+options.organization +'&joinType='+this.data.joinType
              });
          }else{
            this.setData({
                href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/recordList?v=202207281039&openid='+options.openid+'&joinType='+this.data.joinType
            });
          }
        }else{
          if(options.id){
            this.setData({
                  href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/addDetail?v=202207281039&openid='+options.openid+'&id='+options.id+'&organization='+options.organization+'&joinType='+this.data.joinType
              });
          }else{
              this.setData({
                  href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/addDetail?v=202207281039&openid='+options.openid+'&joinType='+this.data.joinType
              });
          }
        }
       
        console.log(this.data.href);
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
        wx.hideHomeButton();
        // wx.showShareMenu({
        //     withShareTicket: true,
        //     menus: ['shareAppMessage', 'shareTimeline']
        // })
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
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