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
    info: {},
    avatar_no: '',
    avatar: '',
    nickname: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getmyInfo()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getmyInfo() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/info'
      })
      console.log(data);
      that.setData({
        info: data,
        avatar: data.avatar,
        nickname: data.nickname
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  getNickname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  chooseImg(e) { //上传图片开始
    let that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
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
  },
  uploadAllfile(filePaths, successUp, failUp, i, length) { // 上传图片至后台
    let that = this;
    let url = 'api/common/upload';
    let headers = {
      "token": wx.getStorageSync("token") || '',
      'content-type': 'multipart/form-data'
    }
    wx.uploadFile({
      url: a.globalData.baseUrl + url, //仅为示例，非真实的接口地址
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
          let data = JSON.parse(res.data)
          console.log(data);
          if (data.code == 1) {
            that.setData({
              avatar_no: data.data.url,
              avatar: data.data.fullurl
            })
            console.log(that.data.avatar)
          }
        } else {
          a.popTest(res.msg)
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
  previewImg1: function (e) { // 预览图片
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var images = this.data.imgList;
    uni.previewImage({
      //当前显示图片
      current: images[index],
      //所有图片
      urls: images
    })
  },
  async submited(e) {
    let that = this
    let username = e.detail.value.nickname
    console.log(username);
    try {
      const {
        data
      } = await request({
        url: 'api/user/profile',
        data: {
          avatar: that.data.avatar_no,
          username
        }
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