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
    line_order_id: '',
    pay: '',
    cause: '',
    is_true: false,
    ticket: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      line_order_id: options.id,
      pay: options.pay,
      ticket: options.ticket,
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
        url: 'api/common/getConfig',
        data: {
          type: 7,
        }
      })
      console.log(data);
      that.setData({
        content: data.refund_text.replace(/&nbsp;/g, '\xa0')
      })
      WxParse.wxParse('content', 'html', that.data.content, that, 5);

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },

  getTextarea(e) {
    this.setData({
      cause: e.detail.value
    })
  },

  async submitMark() {
    let that = this
    let cause = that.data.cause
    if (cause == '') {
      a.popTest('请填写退款原因')
      return
    } else {
      that.setData({
        is_true: true
      })
      if (that.data.ticket == 1) {

        try {
          const {
            data
          } = await request({
            url: 'api/line.line_order/refund',
            data: {
              line_order_id: that.data.line_order_id,
              cause: that.data.cause,
            }
          })
          console.log(data);
          if (data.code == 1) {
            a.popSuccessTest(data.msg)
            that.setData({
              is_true: false
            })
            setTimeout(() => {
              // wx.navigateBack()
              wx.navigateTo({
                url: '/pages/myOrder/myOrder?is_nav=0' + '&status=0'
              })
            }, 800);
          }

        } catch (err) {
          console.log(err);
          a.popTest(err.msg)
          that.setData({
            is_true: false
          })
        }
      } else {
        try {
          const {
            data
          } = await request({
            url: 'api/litestore.litestore_order/refund',
            data: {
              order_id: that.data.line_order_id,
              cause: that.data.cause,
            }
          })
          console.log(data);
          if (data.code == 1) {
            a.popSuccessTest(data.msg)
            that.setData({
              is_true: false
            })
            setTimeout(() => {
              // wx.navigateBack()
              wx.navigateTo({
                url: '/pages/myOrder/myOrder?is_nav=1' + '&status=0'
              })
            }, 800);
          }

        } catch (err) {
          console.log(err);
          a.popTest(err.msg)
          that.setData({
            is_true: false
          })
        }
      }
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