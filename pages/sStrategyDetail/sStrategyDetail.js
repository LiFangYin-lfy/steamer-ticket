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
    strategy_id: '',
    per_page: 2,
    content: '',
    video: ''
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    let token = wx.getStorageSync('token')
    that.setData({
      strategy_id: options.id,
    })
    that.getContest()

    if (token) {
      that.getTuijie()
    }

  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getTuijie() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/hotList',
        data: {
          per_page: that.data.per_page
        }
      })
      console.log(data);
      that.setData({
        tuiList: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getContest() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/strategy.strategy/getInfo',
        data: {
          strategy_id: that.data.strategy_id
        }
      })
      console.log(data);
      that.setData({
        content: data.content.replace(/&nbsp;/g, '\xa0'),
        strategy: data,
        video: data.video
      })
      WxParse.wxParse('content', 'html', that.data.content, that, 5);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  goToDeatils(e) {
    let id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + id
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
      a.popTest(err.msg)
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