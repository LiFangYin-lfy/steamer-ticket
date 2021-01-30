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
    limit: '15',
    hotList: [],
    historyList: [],

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.getSearchList()
  },
  onShow: function () {
    this.setData({
      historyList: []
    })
    this.getHistoryList()


  },
  goback() {
    wx.navigateBack()
  },
  navtosearch(e) { // 搜索
    console.log(e.detail.value);
    this.setData({
      title: e.detail.value
    })

  },
  getInput(e) { // confirm 搜索
    console.log(e.detail.value);
    wx.navigateTo({
      url: '/pages/sMoreList/sMoreList?kw=' + e.detail.value
    })
  },
  searchInput() { // 搜索
    wx.navigateTo({
      url: '/pages/sMoreList/sMoreList?kw=' + this.data.title
    })
  },
  delInput() { // 清空
    this.setData({
      title: ''
    })
  },
  getHotRlt(e) { // 热门搜索跳页
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/sMoreList/sMoreList?kw=' + title
    })
  },
  async getHistoryList() { //搜索记录列表 
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/keyword_log/getKeyword',
        data: {
          limit: that.data.limit
        }
      })
      console.log(data);
      that.setData({
        historyList: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getSearchList() { // 获取热门搜索
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/hot_search/getList'
      })
      console.log(data);
      that.setData({
        hotList: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async delSearch() { // 删除历史记录
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/keyword_log/delKeyword',
      })
      console.log(data);
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        that.setData({
          historyList: []
        })
      }

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
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },
})