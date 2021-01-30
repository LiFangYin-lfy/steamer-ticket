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
    autoplay: true,
    interval: 3000,
    indicatorDots: true,
    indicator: '#FFFFFF',
    indicatorActive: '#ACACAC',
    circular: true,
    nav_list: ['分类1', '分类1', '分类3', '分类4'],
    esl: 0,
    cate_id: '',
    page: 1,
    per_page: 10,
    listStore: [],
    myCate: [],
    loop: [],
    it_cloose: false,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getLoop()

    that.getMycateList()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()

  },

  goStrategyDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/sStrategyDetail/sStrategyDetail?id=' + id
    })
  },
  async getLoop() { // 轮播
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/banner/getBanner',
        data: {
          site: 2
        }
      })
      console.log(data);
      that.setData({
        loop: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getListStore() { //  攻略列表
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/strategy.strategy/getList',
        data: {
          page: that.data.page,
          cate_id: that.data.cate_id,
          per_page: that.data.per_page,
        }
      })
      console.log(data);
      that.setData({
        listStore: [...that.data.listStore, ...data.data],
        page: data.current_page,
        last_page: data.last_page,
      })
      if (that.data.listStore.length != 0) {
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
    } catch (err) {
      console.log(err, "出错了");
      a.popTest(err.msg)
    }
  },
  async getMycateList() { // 分类
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/strategy.strategy_cate/getCate',
      })
      console.log(data);
      that.setData({
        nav_list: data,
        cate_id: data[0].id
      })
      that.getListStore()

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  switchTap(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    that.setData({
      esl: index,
      cate_id: id,
      page: 1,
      listStore: [],
      it_cloose: false
    })
    that.getListStore()
  },
  onReachBottom() {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    if (that.data.page != that.data.last_page) {
      newpageNum++;
      that.setData({
        page: newpageNum,
        it_cloose: false
      })
      that.getListStore()
    }
  },
  godetailsImg(e) { // 轮播详情
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    console.log(index, item);
    let type = Number(item.type)
    switch (type) {
      case 0:
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + item.goods_id
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/myNoticeDetail/myNoticeDetail?id=' + item.notice_id
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/sStrategyDetail/sStrategyDetail?id=' + item.id
        })
        break;
      default:
        break;
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