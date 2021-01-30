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
    id: '',
    content: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      id: options.id,
    })
    that.getDetailsImg()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getDetailsImg() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/banner/getBannerInfo',
        data: {
          banner_id: that.data.id
        }
      })
      console.log(data);
      that.setData({
        content: data.replace(/&nbsp;/g, '\xa0')
      })
      WxParse.wxParse('content', 'html', that.data.content, that, 5);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
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
})