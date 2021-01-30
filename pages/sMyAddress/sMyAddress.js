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
    setTrue: false,
    ressList: [],
    it_cloose: false,
    address: '',
    nonono:false
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
  },
  onShow: function () {
    let that = this
    that.getAddress()

  },
  goback() {
    wx.navigateBack()
  },
  async getAddress() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user_address/getUserAddressList',
      })
      console.log(data);
      if (data.length != 0) {
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      that.setData({
        ressList: data
      })
    } catch (err) {
      console.log(err);
      // a.popTest(err.msg)
      this.setData({
        nonono:true
      })
    }
  },
  async setMoTrue(e) {
    let id = e.currentTarget.dataset.id
    let is_default = e.currentTarget.dataset.default
    let that = this
    if (is_default == 1) {
      is_default = 0
    } else {
      is_default = 1
    }
    try {
      const {
        data
      } = await request({
        url: 'api/user_address/editUserAddress',
        data: {
          user_address_id: id,
          default: is_default
        }
      })
      console.log(data);
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        setTimeout(() => {
          that.getAddress()
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  getDelete(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确认要删除该地址吗？',
      success: async function (res) {
        if (res.confirm) {
          try {
            const {
              data
            } = await request({
              url: 'api/user_address/delUserAddress',
              data: {
                user_address_id: id
              }
            })
            console.log(data);
            if (data.code == 1) {
              a.popSuccessTest(data.msg)
              setTimeout(() => {
                that.getAddress()
              }, 1000);
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
  getEditor(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/sAddressStatus/sAddressStatus?id=' + id
    })
  },
  goNewAddress() {
    wx.navigateTo({
      url: '/pages/sAddressStatus/sAddressStatus'
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