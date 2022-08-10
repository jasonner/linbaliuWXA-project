// pages/guide/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr:[{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-1.png',
      text1:'送检流程',
      text2:'概述'
    },{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-2.png',
      text1:'信息收集',
      text2:'及样本准备'
    },{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-3.png',
      text1:'样本不合格',
      text2:'二次检测流程',
    },{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-4.png',
      text1:'保存草稿',
      text2:'',
    },{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-5.png',
      text1:'提交记录',
      text2:'及查询'
    },{
      iconSrc:'https://forhoooss.wfbweb.com/2022/wj/linbaliu0609/guildSongjian/icon-6.png',
      text1:'后续用药',
      text2:'跟进'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      listShow:options.id
    })
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

  lookDetail(e){
    switch (e.currentTarget.dataset.index) {
      case 1:
        wx.navigateTo({
          url: '/pages/InspectionProcess/index?id='+e.currentTarget.dataset.index,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/collectInformation/index?id='+e.currentTarget.dataset.index,
        })
        break; 
      case 3:
        wx.navigateTo({
          url: '/pages/sampleUnqualified/index?id='+e.currentTarget.dataset.index,
        })
        break; 
      case 4:
        wx.navigateTo({
          url: '/pages/saveDraft/index?id='+e.currentTarget.dataset.index,
        })
        break; 
        case 5:
        wx.navigateTo({
          url: '/pages/recordQuery/index?id='+e.currentTarget.dataset.index,
        })
        break; 
        case 6:
        wx.navigateTo({
          url: '/pages/guildList/MedicationfollowUp/index?id='+e.currentTarget.dataset.index,
        })
        break; 
      default:
        break;
    }
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