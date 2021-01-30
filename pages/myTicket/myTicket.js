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
    ticket: {},
    line_order_id: '',
    notice: '',
    time: 30 * 60 * 60 * 1000,
    start_address: '',
    end_address: '',
    refund: [],

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      line_order_id: options.id,
    })
    that.ticketDetail()
    // that.getConfiguration()
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
  async getConfiguration() { //获取配置北海
    let that = this
    let ticket = that.data.ticket
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: '3'
        }
      })
      console.log(data);
      if (ticket.start == '北海') {
        that.setData({
          start_address: data.beihai.address + data.beihai.ticket_address
        })
      } else {
        that.setData({
          end_address: data.beihai.address + data.beihai.name
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getConfT() { //获取配置
    let that = this
    let ticket = that.data.ticket

    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: '2'
        }
      })
      console.log(data);
      if (ticket.start == '北海') {
        that.setData({
          end_address: data.weizhou.address + data.weizhou.name
        })

      } else {
        that.setData({
          start_address: data.weizhou.address + data.weizhou.ticket_address
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  goDrawback(e) {
    let id = e.currentTarget.dataset.id
    let pay = e.currentTarget.dataset.pay
    wx.navigateTo({
      url: '/pages/drawback/drawback?id=' + id + '&pay=' + pay + '&ticket=1'
    })

  },
  cancelTicket(e) { // 取消订单 （ 船
    let line_order_id = e.currentTarget.dataset.id
    let that = this
    that.setData({
      is_true: true
    })
    wx.showModal({
      title: '提示',
      content: '确认要取消该订单吗？',
      success: async function (res) {
        if (res.confirm) {
          try {
            const {
              data
            } = await request({
              url: 'api/line.line_order/cancel',
              data: {
                line_order_id
              }
            })
            console.log(data, "取消订单");
            if (data.code == 1) {
              a.popSuccessTest(data.msg)
              setTimeout(() => {
                that.getMyorderTicket()
              }, 800);
              that.setData({
                is_true: false
              })
            }
          } catch (err) {
            console.log(err);
            a.popTest(err.msg)
            that.setData({
              is_true: false
            })
          }
        } else {
          that.setData({
            is_true: false
          })
        }
      }
    })
  },
  async payTicket(e) { // 支付 （船票）
    let that = this
    let line_order_id = e.currentTarget.dataset.id
    that.setData({
      is_true: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/line.line_order/order_pay',
        data: {
          line_order_id
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
              that.getMyorderTicket()
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