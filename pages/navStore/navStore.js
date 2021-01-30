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
    nav_list: [],
    leftCates: [],
    cateList2: [],
    currentIndex: 0,
    cate_id: '',
    cate_name: '',
    count: 0,
    types: 1,
    page: 1,
    per_page: 8,
    it_cloose: false,
    type_num: 3,
    titleIndex: 1
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({})
    this.getLeftCates()
    let token = wx.getStorageSync('token')
    if (token) {
      that.getshopCount()
    }
  },
  onShow: function () {

  },
  goback() {
    wx.navigateBack()
  },
  async getLeftCates() { // 左分类数据
    let that = this;
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: "api/litestore.litestore_category/getList",
      })
      console.log(data, "左分类数据");
      if (data.length != 0) {
        data.forEach((value, indexone) => {
          if (value.id == that.data.id) {
            that.setData({
              cateList2: value.cate2,
              currentIndex: indexone,
            })
          }
        })
        if (that.data.cate_id == '') {
          that.setData({
            cate_id: data[0].id,
            cate_name: data[0].name
          })
          that.getRgtCates()
        }
        that.setData({
          leftCates: data,
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getRgtCates() { // 右分类数据
    let that = this;
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: "api/litestore.litestore_goods/goodsList",
        data: {
          cate_id: that.data.cate_id,
          types: that.data.types,
          page: that.data.page,
          per_page: that.data.per_page
        }
      })
      console.log(data, "右分类数据");
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
        cateList2: data.data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
      that.setData({
        it_cloose: false
      })
    }



  },
  async getshopCount() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_cart/getTotalNum',
        method: 'GET'
      })
      console.log(data);
      that.setData({
        count: data.cart_total_num
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  itemTap(e) { // 点击事件
    console.log(e);
    let that = this
    that.setData({
      cate_id: e.currentTarget.dataset.id,
      currentIndex: e.currentTarget.dataset.index,
      it_cloose: false,
      page: 1,
      cateList2: [],
    })
    that.getRgtCates()
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
      cateList2: [],
      it_cloose: false
    })
    that.getRgtCates()

  },
  godetails(e) {
    let goods_id = e.currentTarget.dataset.goods_id
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + goods_id
    })
  },
  goSearch() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/search/search'
      })
    } else {
      a.popTest('请登录后操作')
    }

  },
  gosShopCart() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/sShopCart/sShopCart'
      })
    } else {
      a.popTest('请登录后操作')
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