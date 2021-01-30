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
    storeList: [],
    title_name: '商城列表',
    page: 1,
    per_page: 8,
    types: 1,
    cate_id: '',
    it_cloose: false,
    type_num: 3,
    titleIndex: 1,
    total: '',
    keyword: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      cate_id: options.id || '',
      title_name: options.names || '',
      keyword: options.kw || '',
    })
    that.getstoreList()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getstoreList() { // 列表
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/goodsList',
        data: {
          cate_id: that.data.cate_id,
          types: that.data.types,
          page: that.data.page,
          per_page: that.data.per_page,
          keyword: that.data.keyword
        }
      })
      console.log(data, "列表");
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
        storeList: [...that.data.storeList, ...data.data],
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
    let newpageNum = that.data.page;
    let storeList = that.data.storeList;
    if (that.data.total != storeList.length) {
      newpageNum++;
      that.setData({
        page: newpageNum,
        it_cloose: false,
        nomored: false
      })
      that.getstoreList()
    } else {
      that.setData({
        nomored: true
      })
    }

  },
  goToDeatils(e) {
    let id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + id
    })
  },
  gosMoreList(e) {
    let that = this
    let types = e.currentTarget.dataset.types
    if (types == 3) {
      that.setData({
        type_num: 4,
        types: 4,
        titleIndex: 4
      })
    } else if (types == 4) {
      that.setData({
        type_num: 3,
        types: 3,
        titleIndex: 3
      })
    } else {
      that.setData({
        type_num: 3,
        types,
        titleIndex: types
      })
    }
    that.setData({
      page: 1,
      storeList: [],
      it_cloose: false
    })
    that.getstoreList()

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