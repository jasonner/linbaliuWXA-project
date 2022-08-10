// pages/msgListDetail/index.js
const hrp = require('../../api/hrp.js');
Page({

  /**
   * 页面的初始数据
   */
    data: {
        array: ['美国', '中国', '巴西', '日本'],
        index: 0,
        DepartmentSelect:['血液科','淋巴瘤科','其他'],
        DepartmentSelectIndex:0,
        AnnArborSelect:['I','IE','II','IIE','III','IIIE','IIIS','IIIE,S','IV','X'],
        AnnArborSelectIndex:0,
        DiseaseStageSelect:['I期 ','II期','III期间','IV期'],
        DiseaseStageIndex:0,
        InfiltrationSelect:['是','否'],
        InfiltrationIndex:0,
        MycSelelct:['阳性','阴性'],
        MycSelelctIndex:0,
        Bcl2Select:['阳性','阴性'],
        Bcl2SelectIndex:0,
        SampleSelect:['石蜡组织样本','新鲜组织样本','骨髓','外周血'],
        SampleSelectIndex:0,
        radioVal:'1',
        resultShow:true,
        id:'',
        organization:null,
        recordList:{},
        userInfoList:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            id:options.id,
            organization:options.organization
        });
        if(options.organization =='1'){
          this.GetInfoDetailsById();
        }else{
          this.getQueryInfoList();
        }
       
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
       
    },
   
    goback(){
        wx.navigateBack({
          delta: 0,
        })
    },

    radioClick(e){
        console.log(e.currentTarget.dataset.index)
        this.setData({
            radioVal:e.currentTarget.dataset.index
        })
    },

    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    DepartmentSelectChange(e){
        this.setData({
            DepartmentSelectIndex: e.detail.value
        })
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    AnnArborSelectChange(e){ 
        this.setData({
            AnnArborSelectIndex: e.detail.value
        })
    },
    DiseaseStageChange(e){
        this.setData({
            DiseaseStageIndex: e.detail.value
        })
    },
    InfiltrationChange(e){
        this.setData({
            InfiltrationIndex: e.detail.value
        })
    },
    MycPickerChange(e){
        this.setData({
            MycSelelctIndex: e.detail.value
        })
    },
    Bcl2SelectChange(e){
        this.setData({
            Bcl2SelectIndex: e.detail.value
        })
    },
    SampleSelectChange(e){
        this.setData({
            SampleSelectIndex: e.detail.value
        })
    },

    //根据ID查询单条消息(睿昂)
    getQueryInfoList(){
        let that = this;
        hrp.GetDeceteInfoById({ 
        'id':that.data.id,
        'organization':'0',
        }).then((res) => {
            console.log(res.data);
            if (res.data.s) {
                if(res.data.data && res.data.data!=''){ 
                    if(!res.data.data.detectcode || res.data.data.detectcode == 'null'){
                        res.data.data.detectcode = '--'
                    };
                    if(res.data.data.write){
                      res.data.data.write = that.timeStrChange(res.data.data.write*1); 
                    }else{
                      res.data.data.write = that.timeStrChange(res.data.data.u_time); 
                    }
                    
                    switch (res.data.data.diseaseSubtype) {//疾病亚型
                      case 'H1L01':
                            res.data.data.diseaseSubtype = 'B-ALL(急性B淋巴细胞白血病)'
                          break;
                      case 'H1L02':
                            res.data.data.diseaseSubtype = 'T-ALL(急性T淋巴细胞白血病)'
                          break;
                      case 'H1L03':
                            res.data.data.diseaseSubtype = 'AML(急性髓细胞白血病)'
                          break;
                      case 'H1L04':
                            res.data.data.diseaseSubtype = 'APL(急性早幼粒白血病)'
                          break;
                      case 'H1L05':
                            res.data.data.diseaseSubtype = 'MDS(骨髓增生异常综合征)'
                          break;
                      case 'H1L06':
                            res.data.data.diseaseSubtype = 'MPN(骨髓增殖性肿瘤)'
                          break;
                      case 'H1L07':
                            res.data.data.diseaseSubtype = 'CML(慢性粒细胞白血病)'
                          break;
                      case 'H1L08':
                            res.data.data.diseaseSubtype = 'MDS/MPN(MDS伴MPN)'
                          break;
                      case 'H1L09':
                            res.data.data.diseaseSubtype = '治疗相关AML(tAML)'
                          break;
                      case 'H1L10':
                            res.data.data.diseaseSubtype = '家族易感髓系肿瘤'
                          break;
                      case 'H1L11':
                            res.data.data.diseaseSubtype = 'AA(再生障碍性贫血)'
                          break;
                      case 'H1L12':
                            res.data.data.diseaseSubtype = '白血病 其他'
                          break;
                      case 'H1L13':
                            res.data.data.diseaseSubtype = '白血病 诊断不明'
                          break;
                      case 'H1S01':
                            res.data.data.diseaseSubtype = '易栓症'
                          break;
                      case 'H1B01':
                            res.data.data.diseaseSubtype = 'DLBCL(弥漫大B细胞淋巴瘤)'
                          break;
                      case 'H1B02':
                            res.data.data.diseaseSubtype = 'FL(滤泡淋巴瘤)'
                          break;
                      case 'H1B03':
                            res.data.data.diseaseSubtype = 'MCL(套细胞淋巴瘤)'
                          break;
                      case 'H1B04':
                            res.data.data.diseaseSubtype = 'CLL/SLL(慢性淋巴细胞白血病/小细胞淋巴瘤)'
                          break;
                      case 'H1B05':
                            res.data.data.diseaseSubtype = 'LPL/WM(淋巴浆细胞淋巴瘤/华氏巨球蛋白血症)'
                          break;
                      case 'H1B06':
                            res.data.data.diseaseSubtype = 'B细胞淋巴瘤 其他'
                          break;
                      case 'H1B07':
                            res.data.data.diseaseSubtype = 'B细胞淋巴瘤 诊断不明'
                          break;
                      case 'H1T01':
                            res.data.data.diseaseSubtype = 'AITL(血管免疫母细胞T细胞淋巴瘤)'
                          break;
                      case 'H1T02':
                            res.data.data.diseaseSubtype = 'ALCL(间变大细胞淋巴瘤)'
                          break;
                      case 'H1T03':
                            res.data.data.diseaseSubtype = 'PTCL-NOS(外周T细胞淋巴瘤非特指)'
                          break;
                      case 'H1T04':
                            res.data.data.diseaseSubtype = 'NK/T细胞淋巴瘤(NK/T-CL)'
                          break;
                      case 'H1T05':
                            res.data.data.diseaseSubtype = 'T细胞淋巴瘤 其他'
                          break;
                      case 'H1T06':
                            res.data.data.diseaseSubtype = 'T细胞淋巴瘤 诊断不明'
                          break;
                      case 'H1G01':
                            res.data.data.diseaseSubtype = '多发性骨髓瘤(MM)'
                          break;
                      case 'H2H01':
                            res.data.data.diseaseSubtype = '噬血细胞综合征'
                          break;
                      default:
                          break;
                    }
                    that.setData({
                        recordList:res.data.data
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

    //根据ID查询单条消息(金橡)
    GetInfoDetailsById(){
      let that = this;
      hrp.GetInfoDetailsById({ 
        'id':that.data.id,
        'organization':'1',
        }).then((res) => {
          console.log(res.data);
          if(res.data.s){
            if(res.data.data){
              if(!res.data.data.detectcode || res.data.data.detectcode == 'null'){
                  res.data.data.detectcode = '--'
              };
              res.data.data.submissiondate = res.data.data.submissiondate.replace("00:00:00","");
              res.data.data.mianyizuhuajiegou= JSON.parse(res.data.data.mianyizuhuajiegou);
              that.setData({
                recordList:res.data.data
              })
            }else{
              wx.showModal({
                title: '提示',
                content: '暂无数据',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 0
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
           
          }
      })
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

    //查看图片
    lookImg(e){
        console.log(e.currentTarget.dataset.img);
        wx.previewImage({
          urls: [e.currentTarget.dataset.img],
          showmenu:true
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