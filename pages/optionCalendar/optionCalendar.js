import {
  request
} from "../../request/index.js"
const a = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    statusTop: a.globalData.statusHeight,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    minDate: 0,
    maxDate: 0,
    startDate: '',
    ary: {}
  },
  onLoad: function (options) {
    console.log(options);
    let that = this
    let startDate = a.getToday()
    let endDate = a.getOutDay()
    that.setData({
      minDate: new Date(startDate).getTime(),
      maxDate: new Date(endDate).getTime(),
      startDate,
      ary: JSON.parse(options.obj)
    })
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  clisk(e) {
    console.log(e.detail);
    let newStartDate = a.getdateRule(e.detail)
    let obj = this.data.ary
    obj.date = newStartDate
    console.log(obj);
    wx.navigateTo({
      url: '/pages/optionDate/optionDate?obj=' + JSON.stringify(obj)
    })
  },
  async public() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: '',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data);
      that.setData({
        public: data
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            // url: '/pages/authorization/authorization'
          })

        } else {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      }
    })
  },
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },
})