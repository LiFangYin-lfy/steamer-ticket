import {
  request
} from "../../request/index.js"
const a = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    name: "Content",
    baseUrl: a.globalData.baseUrl,
    statusTop: a.globalData.statusHeight,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    id: '',
    content: '',
    type: '',
    contents: '',
    names: '',
    tup: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      type: options.type,
      tup: options.tup || ''
    })
    that.getDetailsImg(options.type)
    if (options.type == 6) {
      that.setData({
        names: '预定须知'
      })
    } else if (options.type == 7) {
      if (options.tup == 0) {
        that.setData({
          names: '取票须知'
        })
      } else {
        that.setData({
          names: '船票退改规则'
        })
      }

    } else if (options.type == 8) {
      that.setData({
        names: '支出部分退'
      })

    }
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getDetailsImg(type) {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: type
        }
      })
      if (type == 6) {
        that.setData({
          contents: data.reserve_text.replace(/&nbsp;/g, '\xa0')
        })
      } else if (type == 7) {
        if (that.data.tup == 0) {
          that.setData({
            contents: data.refund_text.replace(/&nbsp;/g, '\xa0')
          })
        } else {
          that.setData({
            contents: data.refund_text.replace(/&nbsp;/g, '\xa0')
          })
        }
        that.setData({
          contents: data.refund_text.replace(/&nbsp;/g, '\xa0')
        })
      } else if (type == 8) {
        that.setData({
          contents: data.refund1_text.replace(/&nbsp;/g, '\xa0')
        })

      }

      WxParse.wxParse('contents', 'html', that.data.contents, that, 5);

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