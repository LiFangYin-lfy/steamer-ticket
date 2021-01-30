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
    collected: [],
    page: 1,
    total: '',
    it_cloose: false,
    no_more: false,
    per_page: 8,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    let token = wx.getStorageSync('token')
    if (token) {
      that.getCollected()
    }
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  goToDeatils(e) {
    let goods_id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + goods_id
    })
  },
  async getCollected() { // 收藏列表
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/collectList',
        data: {
          page: that.data.page,
          per_page: that.data.per_page
        }
      })
      console.log(data);
      if (data.data.length != 0) {
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      that.setData({
        collected: [...that.data.collected, ...data.data],
        page: data.current_page,
        total: data.total,
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  onReachBottom() {
    let that = this
    let pageNum = that.data.page
    let total = that.data.total
    let collected = that.data.collected
    if (total != collected.length) {
      pageNum++
      that.setData({
        page: pageNum,
        no_more: false,
        it_cloose: false
      })
      that.getCollected()
    } else {
      that.setData({
        no_more: true
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