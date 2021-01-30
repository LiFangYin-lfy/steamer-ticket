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
    notice: '',
    content: '',
    showDialog: false,
    notice_id: '',
    page: 1,
    per_page: '',
    noticeList: [],
    total: 0
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      notice_id: options.id,
    })
    that.getDetail()
    that.getNoticeList()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getDetail() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/notice/getInfo',
        data: {
          notice_id: that.data.notice_id
        }
      })
      console.log(data);
      that.setData({
        notice: data,
        content: data.content.replace(/&nbsp;/g, '\xa0')
      })
      WxParse.wxParse('content', 'html', that.data.content, that, 5);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  async getNoticeList() { // 公告列表
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
      that.setData({
        noticeList: that.data.noticeList.concat(data.data),
        last_page: data.last_page,
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
    let noticeList = that.data.noticeList
    let total = that.data.total
    if (total != noticeList.length) {
      pageNum++
      that.setData({
        page: pageNum,
        no_more: false,
        it_cloose: false
      })
      that.getNoticeList()
    } else {
      that.setData({
        no_more: true
      })
    }
  },


  gerDetail(e) {
    let that = this
    that.setData({
      notice_id: e.currentTarget.dataset.id,
      page: 1,
      no_more: false,
      it_cloose: false,
      noticeList: []
    })
    that.getDetail()
    that.getNoticeList()
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