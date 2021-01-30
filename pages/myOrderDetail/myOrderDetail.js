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
    orderDetail: '',
    order_id: '',
    orderList: [],
    notice: '',
    time: 30 * 60 * 60 * 1000,
    is_true: false,
    refund: [],

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      order_id: options.id,
    })
    that.getOrderDetail()
    // that.ticketDetail()

  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async ticketDetail() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/info',
        data: {
          line_order_id: that.data.line_order_id
        }
      })
      console.log(data);
      that.setData({
        ticket: data,
        notice: data.notice,
        time: Number(data.time) * 1000,
        refund: data.refund
      })
      // WxParse.wxParse('notice', 'html', that.data.notice, that, 5);
      that.getConfiguration()
      that.getConfT()

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getOrderDetail() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_order/detail',
        data: {
          order_id: that.data.order_id
        }
      })
      console.log(data);
      that.setData({
        orderDetail: data.order,
        orderList: data.order.goods,
        notice: data.order.notice,
        time: Number(data.order.time) * 1000,
        refund: data.order.refund
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  clickRefund(e) {
    let id = e.currentTarget.dataset.id
    let pay = e.currentTarget.dataset.pay
    wx.navigateTo({
      url: '/pages/drawback/drawback?id=' + id + '&pay=' + pay + '&ticket=0'
    })
  },
  goTabCounsel(e) { // 去评价
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tabCounsel/tabCounsel?id=' + id
    })
  },
  async clickReceipt(e) { // 确认收货  （商品）
    let that = this
    let order_id = e.currentTarget.dataset.id
    that.setData({
      is_true: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_order/finish',
        data: {
          order_id
        }
      })
      console.log(data, "确认收货");
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        that.setData({
          is_true: false,
          orderList: [],
          page: 1
        })
        setTimeout(() => {
          that.getMyorderStore()
        }, 800);
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        is_true: true
      })
    }
  },
  clickCancel(e) { // 取消订单  （商品）
    let that = this
    let order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确认要取消该订单嘛？',
      success: async function (res) {
        if (res.confirm) {
          try {
            const {
              data
            } = await request({
              url: 'api/litestore.litestore_order/cancel',
              data: {
                order_id
              }
            })
            console.log(data, "取消订单");
            if (data.code == 1) {
              a.popSuccessTest(data.msg)
              setTimeout(() => {
                that.getMyorderStore()
              }, 800);
            }
          } catch (err) {
            console.log(err);
            a.popTest(err.msg)
          }

        } else {

        }
      }
    })

  },
  async clickPay(e) { // 支付 （商品）
    let that = this
    let order_id = e.currentTarget.dataset.id
    that.setData({
      is_true: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_order/order_pay',
        data: {
          order_id
        }
      })
      console.log(data, "支付");
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        wx.requestPayment({
          timeStamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          package: data.data.package,
          signType: 'MD5',
          paySign: data.data.paySign,
          appId: data.data.appId,
          success(res) {
            console.log(res);
            that.setData({
              is_true: false,
              orderList: [],
              page: 1
            })
            setTimeout(() => {
              that.getMyorderStore()
            }, 800);

          },
          fail(res) {
            console.log(res)
            that.setData({
              is_true: false
            })
            wx.redirectTo({
              url: '/pages/myOrder/myOrder?is_nav=1' + '&status=1'
            })
          }
        })

      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        is_true: false
      })
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