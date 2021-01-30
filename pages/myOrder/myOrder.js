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
    type: '',
    esl: 0,
    navList: [],
    orderList: [],
    is_store: false,
    it_cloose: false,
    is_more: false,
    is_true: false,
    is_nav: 1, // 0： 船票  1 商品
    status: 0, // 	0=全部1=待支付2=待发货3=待收货4=待评价5=已完成/售后
    page: 1,
    per_page: 15,
    time: 30 * 60 * 60 * 1000,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.is_nav) {
      if (options.is_nav == 0) {
        let ind = Number(options.status)
        that.setData({
          is_nav: options.is_nav
        })
        switch (ind) {
          case 0:
            that.setData({
              status: 0,
              esl: 0
            })
            break;
          case 10:
            that.setData({
              status: 10,
              esl: 1
            })
            break;
          case 30:
            that.setData({
              status: 30,
              esl: 2
            })
            break;
          case 40:
            that.setData({
              status: 40,
              esl: 3
            })
            break;
          case 70:
            that.setData({
              status: 70,
              esl: 4
            })
            break;
          default:
            break;
        }
        that.getMyorderTicket() // 船票
        that.setData({
          navList: ['全部', '待支付', '待出单', '已出单', '已完成/售后']
        })
      } else {
        that.setData({
          is_nav: options.is_nav || '',
          esl: options.status || '', //  支付状态
          navList: ['全部', '待支付', '待发货', '待收货', '评价', '已完成/售后'],
          status: options.status
        })
        that.getMyorderStore() //  商城
      }
    }
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  changeOrder(e) {
    let that = this
    let is_nav = e.currentTarget.dataset.is_nav
    if (is_nav == 0) { // 船票
      that.setData({
        is_nav,
        status: 0,
        esl: 0,
        navList: ['全部', '待支付', '待出单', '已出单', '已完成/售后']
      })
      that.getMyorderTicket()
    } else {
      that.setData({
        esl: 0,
        is_nav,
        status: 0,
        navList: ['全部', '待支付', '待发货', '待收货', '评价', '已完成/售后']
      })
      that.getMyorderStore()
    }
    that.setData({
      page: 1,
      orderList: [],
      it_cloose: false,
      is_more: false,
    })

  },
  switchTap(e) {
    let that = this
    let is_nav = that.data.is_nav
    let index = e.currentTarget.dataset.index;
    if (is_nav == 0) {
      switch (index) {
        case 0:
          that.setData({
            status: 0
          })
          break;
        case 1:
          that.setData({
            status: 10
          })
          break;
        case 2:
          that.setData({
            status: 30
          })
          break;
        case 3:
          that.setData({
            status: 40
          })
          break;
        case 4:
          that.setData({
            status: 70
          })
          break;
        default:
          break;
      }
      that.setData({
        esl: index,
        page: 1,
        it_cloose: false,
        orderList: [],
        is_more: false,
      })
      that.getMyorderTicket()
    } else {
      that.setData({
        esl: index,
        status: index,
        page: 1,
        it_cloose: false,
        orderList: [],
        is_more: false,
      })
      that.getMyorderStore()
    }

  },
  async getMyorderStore() { // 获取商城订单
    let that = this;
    try {
      const {
        data: {
          data
        }
      } = await
      request({
        url: 'api/litestore.litestore_order/my',
        data: {
          status: that.data.status,
          page: that.data.page,
          per_page: that.data.per_page
        }
      })
      if (that.data.orderList.length != 0) {
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      console.log(data);
      data.data.forEach(item => {
        console.log(item.time);
        item.time = Number(item.time) * 1000
        console.log(item.time);
      });
      that.setData({
        // orderList: [...data.data, ...that.data.orderList],
        orderList: [...data.data],
      })
      console.log(that.data.orderList, "商城订单");
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        it_cloose: false
      })
    }
  },
  goOrderDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?id=' + id
    })
  },
  lookedRule() { // 船票退改规则
    wx.navigateTo({
      url: '/pages/detailPage/detailPage?type=7' + '&tup=1'
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
  clickEvidence(e) { // 查看凭证
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?id=' + id
    })
  },
  goTabCounsel(e) { // 去评价
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tabCounsel/tabCounsel?id=' + id
    })
  },
  clickRefund(e) {
    let id = e.currentTarget.dataset.id
    let pay = e.currentTarget.dataset.pay
    wx.navigateTo({
      url: '/pages/drawback/drawback?id=' + id + '&pay=' + pay + '&ticket=0'
    })
  },


  // --------------------------------------------------------------------
  async getMyorderTicket() { // 获取船票订单
    let that = this;
    try {
      const {
        data: {
          data
        }
      } = await
      request({
        url: 'api/line.line_order/lis',
        data: {
          status: that.data.status,
          page: that.data.page,
          per_page: that.data.per_page
        }
      })
      console.log(data.data, "船票订单");
      if (data.data.length == 0) {
        that.setData({
          it_cloose: true
        })
      } else {
        that.setData({
          it_cloose: false
        })
      }
      data.data.forEach(item => {
        console.log(item.time);
        item.time = Number(item.time) * 1000
        console.log(item.time);
      });
      that.setData({
        orderList: [...that.data.orderList, ...data.data],
      })

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        it_cloose: false
      })
    }
  },
  gomyTicket(e) { // 船票详情
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myTicket/myTicket?id=' + id
    })
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
              console.log("11111111")
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
  editotTicket() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您如果要改签，需电话联系客服',
      success: function (res) {
        if (res.confirm) {

          that.telPhone()
        } else {

        }
      }
    })
  },
  async telPhone() { // 系统配置客服电话
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: 4
        }
      })
      console.log(data);
      wx.makePhoneCall({
        phoneNumber: data.service_mobile
      })
      that.setData({})
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