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
    star: 4,
    imgList: 4,
    parse: {},
    order_id: '',
    arr: [], // 数组[order_goods_id=>订单详情id,content=>内容,score=>评分,images=>图片]
    order_list: [],
    i: '',
    is_true: false,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      order_id: options.id,
    })
    that.getParse()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getParse() { // 订单详情
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_order/detail',
        data: {
          order_id: that.data.order_id
        }
      })
      console.log(data);
      if (data.order.goods.length != 0) {
        data.order.goods.forEach(item => {
          item.star = [a.globalData.imagesUrl + '/img_26.png', a.globalData.imagesUrl + '/img_26.png', a.globalData.imagesUrl + '/img_26.png', a.globalData.imagesUrl + '/img_26.png', a.globalData.imagesUrl + '/img_26.png'];
          item.textarea = ''
          item.imgList = []
          item.images = []
          item.cursor = 0
          item.score = 0
        });
      }
      that.setData({
        parse: data.order,
        order_list: data.order.goods
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  selectStar(e) {
    console.log(e)
    let that = this
    let list = that.data.order_list,
      send = e.currentTarget.dataset.index,
      send1 = e.currentTarget.dataset.index1,
      starList = list[send].star;
    list[send].score = send1 + 1
    console.log(send, send1, starList);
    for (var j = 0; j < starList.length; j++) {
      if (j <= send1) {
        starList[j] = a.globalData.imagesUrl + '/img_27.png';
      } else {
        starList[j] = a.globalData.imagesUrl + '/img_26.png';
      }
    }
    that.setData({
      order_list: list,


    })
    console.log(that.data.order_list);
  },

  getcursor(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    let order_list = that.data.order_list
    order_list[send].textarea = e.detail.value
    order_list[send].cursor = e.detail.cursor
    that.setData({
      order_list
    })
  },
  chooseImg(e) { //上传图片开始
    var that = this;
    that.setData({
      i: e.currentTarget.dataset.index
    })
    let images = that.data.order_list[e.currentTarget.dataset.index].imgList
    if (images.length < 10) {
      wx.chooseImage({
        count: 9, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          let successUp = 0; //成功个数
          let failUp = 0; //失败个数
          let i = 0; //第几个
          let length = res.tempFilePaths.length //总共个数
          wx.showNavigationBarLoading()
          wx.showLoading({
            title: '上传中',
          })
          that.uploadAllfile(tempFilePaths, successUp, failUp, i, length);
        },
      });
    } else {
      a.popTest('最多上传9张图片')
    }
  },
  uploadAllfile(filePaths, successUp, failUp, i, length) { // 上传图片至后台

    let that = this;
    let im = that.data.i
    let url = 'api/common/upload';
    let headers = {
      "token": wx.getStorageSync("token") || '',
      'content-type': 'multipart/form-data'
    }
    wx.uploadFile({
      url: a.globalData.baseUrl + url,
      header: headers,
      filePath: filePaths[i],
      name: 'file',
      formData: {
        file: '',
        filetype: 'image'
      },
      success: function (res) {
        console.log(res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (res.statusCode == 200) {
          console.log(res)
          let data = JSON.parse(res.data)
          console.log(data);
          if (data.code == 1) {
            console.log(data.data);
            let list = that.data.order_list;
            list[im].images.push(data.data.fullurl);
            list[im].imgList.push(data.data.url);
            that.setData({
              order_list: list
            })
            console.log(that.data.order_list);
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        console.log(res);
      },
      complete() {
        i++;
        // let img = t.data.img
        if (i == length) {
          // console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
        } else {
          //递归调用uploadDIY函数
          that.uploadAllfile(filePaths, successUp, failUp, i, length);
        }
      }
    })

  },
  deleteImg(e) { // 删除图片
    console.log(e)
    var that = this;
    let order_list = that.data.order_list
    var send = e.currentTarget.dataset.index;
    var send1 = e.currentTarget.dataset.index1;
    var images = order_list[send].images
    var imgList = order_list[send].imgList
    images.splice(send1, 1);
    imgList.splice(send1, 1);
    this.setData({
      order_list
    })
  },
  previewImg1: function (e) { // 预览图片
    let that = this
    var send = e.currentTarget.dataset.index;
    var send1 = e.currentTarget.dataset.index1;
    var images = that.data.order_list[send].images;
    wx.previewImage({
      current: images[send1],
      urls: images
    })
  },
  async release() { // 发布评价
    let that = this
    let order_list = that.data.order_list
    console.log(order_list);
    let ary = [];
    order_list.forEach(item => {
      let obj = {}
      obj.order_goods_id = item.id
      obj.content = item.textarea
      obj.score = item.score
      obj.images = item.imgList.join(',')
      ary.push(obj)
    })
    console.log(ary);
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_order/comment',
        data: {
          order_id: that.data.order_id,
          data: ary,
        },
        method: 'POST'
      })
      console.log(data);
      if (data.code == 1) {
        a.popSuccessTest(data.msg)
        setTimeout(() => {
          wx.navigateBack()
        }, 800);
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  getconfirm(e) { // 评价
    console.log(e);
    let that = this
    let send = e.currentTarget.dataset.index
    let order_list = that.data.order_list
    order_list[send].textarea = e.detail.value
    order_list[send].cursor = e.detail.cursor
    that.setData({
      order_list
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
      a.popTest(err.msg)
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

})