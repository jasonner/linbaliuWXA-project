// pages/webView/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        href:'',
        openid:'',
        id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            id:options.id,
            openid:options.openid,
        });
        if(options.id){
            this.setData({
                href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/recordDetail?openid='+options.openid+'&id='+options.id
            });
        }else{
            this.setData({
                href: 'https://apiz.forhoo.com.cn/2022/wj/linbaliu0310/index.html#/recordDetail?openid='+options.openid
            });
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