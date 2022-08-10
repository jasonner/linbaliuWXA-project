// pages/videoPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/video/videobuhege.mp4',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    switch (options.id) {
      case '1':
        that.setData({
          videoSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/video/videobuhege.mp4'
        })
        break;
      case '2':
        that.setData({
          videoSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/video/videoIOS.mp4'
        })
        break;
      case '3':
        that.setData({
          videoSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/video/videoAndroid.mp4'
        })
        break;
      default:
        break;
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