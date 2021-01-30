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
    nine: 9,
    msg: '',
    it_cloose: false,
    nomore: false,
    evaluate: [],
    page: 1,
    per_page: 10,
    goods_id: '',
    id: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      goods_id: options.goods_id,
    })
    that.getall()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getall() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/comment',
        data: {
          goods_id: that.data.goods_id,
          page: that.data.page,
          per_page: that.data.per_page,
        }
      })
      console.log(data);
      that.setData({
        evaluate: [...that.data.evaluate, ...data.data],
        total: data.total,
      })
      if (that.data.evaluate.length == 0) {
        that.setData({
          it_cloose: true
        })
      } else {
        that.setData({
          it_cloose: false
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },

  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    if (that.data.total != that.data.evaluate.length) {
      newpageNum++;
      that.setData({
        page: newpageNum,
        nomore: false,
        it_cloose: false,
      })
      that.getall()
    } else {
      that.setData({
        nomore: true
      })
    }
  },
  previewImg(e) { // 预览图片
    let that = this
    var send = e.currentTarget.dataset.index;
    var send1 = e.currentTarget.dataset.index1;
    var images = that.data.evaluate[send].images;
    wx.previewImage({
      current: images[send1],
      urls: images
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


})