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
    openid: '',
    session_key: '',
    encrypted_data: '',
    iv: '',
    code: '',
    info: {},
    nickname: '',
    avatar: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getcode()
  },
  onShow: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.getmyInfo()
      that.getOrderNum()
      that.getTicketNum()
    }
  },
  goback() {
    wx.navigateBack()
  },
  goMyCollected() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/sMyCollected/sMyCollected'
      })
    } else {
      let msg = '请登录后操作'
      this.popTest(msg)
    }
  },
  goAddress() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/sMyAddress/sMyAddress'
      })
    } else {
      let msg = '请登录后操作'
      this.popTest(msg)
    }
  },

  goMyOrder(e) { // 前往商品
    let type = e.currentTarget.dataset.type
    let is_nav = e.currentTarget.dataset.is_nav
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?status=' + type + '&is_nav=' + is_nav
      })
    } else {
      let msg = '请登录后操作'
      this.popTest(msg)
    }
  },
  getcode() {
    let that = this
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          console.log(res.code);
          that.setData({
            code: res.code
          })
          // that.getToken()
          request({
            url: 'api/wechat/getSessionKey',
            data: {
              code: res.code
            },
            method: 'POST'
          }).then(res => {
            console.log(res);
            console.log(res.data.data);
            that.setData({
              openid: res.data.data.openid,
              session_key: res.data.data.session_key,
            })
          }).catch(err => {
            console.log(err);
            that.setData({
              msg: err.msg
            })
            that.popTest()
          })
          // console.log();
        }
      }
    })
  },
  async getToken() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/wechat/getToken',
        data: {
          code: that.data.code
        },
        method: 'POST'
      })
      console.log(data);
      if (data.code == 1) {
        console.log(data);
      };
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async bindGetUserInfo(e) {
    let that = this
    console.log(e);
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/sMyProfile/sMyProfile'
      })
    } else {
      try {
        const {
          data
        } = await request({
          url: 'api/wechat/login',
          method: "POST",
          data: {
            iv: e.detail.iv,
            encrypted_data: e.detail.encryptedData,
            session_key: that.data.session_key,
            openid: that.data.openid
          }
        })
        console.log(data);
        if (data.code == 1) {
          that.setData({
            msg: data.msg,
          })
          that.popSuccessTest()
          wx.setStorageSync('token', data.data.token)
          that.getmyInfo()
        }
      } catch (err) {
        console.log(err);
        that.setData({
          msg: err.msg
        })
        that.popTest()
      }
    }
  },
  async getmyInfo() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/info',
      })
      console.log(data);
      that.setData({
        info: data,
        avatar: data.avatar,
        nickname: data.nickname
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getOrderNum() { //订单数量 
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_order/Get_order_num',
      })
      console.log(data, "订单数量 ");
      that.setData({
        // NoFreightNum,
        orderNum: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTicketNum() { //船票订单数量 
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line_order/count',
      })
      console.log(data, "订单数量 ");
      that.setData({
        ticketNum: data
      })
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
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },
  popTest(msg) {
    wx.showToast({
      title: msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 800
    })
  },
})