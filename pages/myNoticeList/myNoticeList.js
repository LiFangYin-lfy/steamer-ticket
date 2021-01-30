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
    four: 6,
    msg: '',
    kw: '',
    page: 1,
    per_page: 15,
    homeInfo: [],
    last_page: '',
    it_cloose: false,

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getMynotice()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  getResult(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myNoticeDetail/myNoticeDetail?id=' + id
    })
  },
  async getMynotice() { // 公告
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/notice/getList',
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
        homeInfo: data.data,
        last_page: data.last_page,
        page: data.current_page,
        total: data.total
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },

  onReachBottom() {
    let that = this
    let newpageNum = that.data.page;
    if (that.data.page != that.data.last_page) {
      newpageNum++;
      that.setData({
        page: newpageNum,
        it_cloose: false
      })
      that.getMynotice()
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