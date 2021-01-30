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
    titleList: [],
    piaoData: {},
    openvar: false,
    session_key: '',
    code: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      id: options.id,
    })
    that.getTitleList()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getTitleList() { //详情
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/line.line/getInfo',
        data: {
          line_id: that.data.id
        }
      })
      console.log(data);
      that.setData({
        piaoData: data,
        titleList: data.line_cabin
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  goContent(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/detailPage/detailPage?type=' + type
    })
  },
  goContent1(e) {
    let type = e.currentTarget.dataset.type
    let tup = e.currentTarget.dataset.tup
    wx.navigateTo({
      url: '/pages/detailPage/detailPage?type=' + type + '&tup=' + tup
    })
  },
  gofillOrder(e) {
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    let count = e.currentTarget.dataset.count
    if (token) {
      if (count > 10) {
        // qiang=0 表示正常购票
        wx.navigateTo({
          url: '/pages/fillOrder/fillOrder?id=' + id + '&qiang=0'
        })
      }

    } else {
      this.onClickOpen()
    }
  },
  onClickOpen() {
    let that = this
    this.setData({
      openvar: !this.data.openvar
    })
    console.log(this.data.openvar);
    let token = wx.getStorageSync('token')
    if (!token) {
      that.getLoginCode()
    }
  },
  getLoginCode() {
    let that = this
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          console.log(res.code);
          request({
            url: 'api/wechat/getSessionKey',
            data: {
              code: res.code
            },
            method: 'POST'
          }).then(res => {
            console.log(res.data.data);
            that.setData({
              session_key: res.data.data.session_key,
              openid: res.data.data.openid
            })
          }).catch(err => {
            console.log(err, "登录报错");
            a.popTest(err.msg)
          })
        }
      },

    })
  },
  async bindGetUserInfo(e) {
    let that = this
    console.log(e);
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
        a.popSuccessTest(data.msg)
        wx.setStorageSync('token', data.data.token)
        that.setData({
          openvar: false
        })
      }
    } catch (err) {
      a.popTest('您拒绝了授权')
      if (err.code == 0) {
        this.setData({
          openvar: !this.data.openvar
        })
      }
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
  consume() {},

})