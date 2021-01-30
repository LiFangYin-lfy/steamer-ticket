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
    buy_time: '',
    startDate: '',
    endDate: '',
    weekArray: '',
    homeInfo: [{
        id: 1,
        cnt: '与10月6日涠洲岛至北海航线优与10月6日涠洲岛至北海航线优'
      },
      {
        id: 2,
        cnt: '与10月7日涠洲岛至北海航线优与10月7日涠洲岛至北海航线优'
      }, {
        id: 3,
        cnt: '与10月8日涠洲岛至北海航线优惠与10月8日涠洲岛至北海航线优惠'
      }, {
        id: 4,
        cnt: '与10月9日涠洲岛至北海航线优惠与10月9日涠洲岛至北海航线优惠'
      },
    ],
    sort_list: 8,
    esl: 0,
    nav_list: ['船票预定', '船票预定', '游玩项目', '旅拍跟拍'],
    loop: [],
    noticeList: [],
    myticket: '',
    myCate: [],
    titleList: [],
    listStore: [],
    page: 0,
    per_page: 15,
    total: 0,
    nomore: false,
    start_name: '北海',
    end_name: '涠洲',
    cate_id: '',
    types: 1,
    it_cloose: false,
    showDialog: false, //公告是否出现
    showDialogImg: '', //广告图片
    logo_img: '',
    list: [{
      start_name: '北海',
      end_name: '涠洲',
      id: '1',
      is_false: 0,
    }, {
      start_name: '涠洲',
      end_name: '北海',
      id: '2',
      is_false: 0,
    }],
    start_a: '',
    end_a: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getLoop()
    that.getMynotice()
    that.getMycateList()
    that.getLogo()
    let buy_time = a.getToday()
    let week = new Date(buy_time)
    let weekArray = a.getWeek(week)
    that.setData({
      buy_time,
      weekArray
    })
  },
  onShow: function () {
    if (wx.getStorageSync('token')) {
      this.getshowDialog()
    }
  },
  goback() {
    wx.navigateBack()
  },
  closeIcon() {
    this.setData({
      showDialog: false
    })
  },
  bindTimeChange(e) { // 时间
    let that = this
    let startDate = a.getToday()
    let endDate = a.getOutDay()
    let week = new Date(e.detail.value)
    let weekArray = a.getWeek(week)
    that.setData({
      startDate,
      endDate,
      weekArray
    })
    this.setData({
      buy_time: e.detail.value
    })
  },
  goMyNoticeList() { // 去公告列表
    wx.navigateTo({
      url: '/pages/myNoticeList/myNoticeList'
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
          site: 1
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
  async getLogo() { // logo
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/getConfig',
        data: {
          type: 9
        }
      })
      console.log(data);
      that.setData({
        logo_img: data.logo
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getshowDialog() { //公告是否出现
    const that = this
    try {
      const {
        data
      } = await request({
        url: 'api/notice/getImage',
      })
      if (data.data != '') {
        that.setData({
          showDialog: true,
          showDialogImg: data.data.image
        })
      } else {
        that.setData({
          showDialog: false
        })
      }
    } catch (err) {

    }
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
          page: 1,
          per_page: that.data.per_page
        }
      })
      console.log(data);
      that.setData({
        homeInfo: data.data
      })
    } catch (err) {
      console.log(err);
      let msg = err.msg
      a.popTest(msg)
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
        url: 'api/litestore.litestore_category/getList',
      })
      console.log(data);
      if (data.length != 0) {
        that.setData({
          cate_id: data[0].id
        })
        console.log(data[0].id, "data[0].id");
        that.getListStore()
      }
      that.setData({
        myCate: data
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getListStore() { // 商品列表
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_goods/goodsList',
        data: {
          page: that.data.page,
          cate_id: that.data.cate_id,
          types: that.data.types,
          per_page: that.data.per_page,
        }
      })
      console.log(data);
      that.setData({
        listStore: [...that.data.listStore, ...data.data],
        page: data.current_page,
        total: data.total,
      })
      if (that.data.listStore.length == 0) {
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
  changeItem() { // 切换
    let that = this
    that.setData({
      start_name: that.data.end_name,
      end_name: that.data.start_name
    })
  },
  cateChange(e) { // 图标分类跳页
    console.log(e.currentTarget.dataset);
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/sMoreList/sMoreList?id=' + item.id + '&names=' + item.name
    })
  },
  ticketQuery() { // 查询
    let that = this
    let obj = {}
    obj.date = that.data.buy_time;
    obj.start_name = that.data.start_name;
    obj.end_name = that.data.end_name;
    wx.navigateTo({
      url: '/pages/optionDate/optionDate?obj=' + JSON.stringify(obj)
    })
  },
  goToDeatils(e) {
    let that = this
    let goods_id = e.currentTarget.dataset.goods_id
    console.log(goods_id);
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + goods_id
    })
  },
  goTicketDetail(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myNoticeDetail/myNoticeDetail?id=' + id
    })
  },

  godetailsImg(e) { // 轮播详情
    let item = e.currentTarget.dataset.item
    console.log(item);
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
          url: '/pages/navLoopDetails/navLoopDetails?id=' + item.id
        })
        break;

      default:
        break;
    }
  },
  goSdearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  switchTap(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      esl: e.currentTarget.dataset.index,
      listStore: [],
      page: 1,
      nomore: false,
      it_cloose: false,
      cate_id: e.currentTarget.dataset.id
    })
    this.getListStore()
  },
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    if (that.data.total != that.data.listStore.length) {
      newpageNum++;
      that.setData({
        page: newpageNum,
        nomore: false,
        it_cloose: false,
      })
      that.getListStore()
    } else {
      that.setData({
        nomore: true
      })
    }
  },
  onShareAppMessage(options) {
    let shareObj = {
      title: "船务购票",
      path: '/pages/navHome/navHome',
      imageUrl: '',
    };
    return shareObj;
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
  showModal() { //显示对话框
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal() { //隐藏对话框
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  trueClick(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    console.log(send);
    let list = that.data.list
    list.forEach((item, index) => {
      item.is_false = 0
      if (index == send) {
        item.is_false = 1
        if (that.data.start_name == item.start_name) {
          console.log(item.start_name);
          that.setData({
            start_name: item.start_name,
            end_name: item.end_name,
          })
        } else {
          console.log(item.end_name);
          that.setData({
            end_name: item.end_name,
            start_name: item.start_name,
          })
        }
      }
    });
    that.setData({
      list
    })

  },
  setTrue() {
    this.hideModal()
  },
  setFalse() {
    let that = this
    let start_a = that.data.start_a
    if (start_a == this.data.start_name) {
      this.setData({
        start_name: this.data.start_name,
        end_name: this.data.end_name,
      })
    } else {
      this.setData({
        start_name: this.data.end_name,
        end_name: this.data.start_name,
      })
    }
    this.hideModal()
  },
  changeItem3() {
    let that = this
    let str = that.data.start_name
    that.setData({
      start_a: that.data.start_name,
      end_a: that.data.end_name,
    })
    let list = that.data.list
    for (let index = 0; index < list.length; index++) {
      list[index].is_false = 0;
      if (str == list[index].start_name) {
        list[index].is_false = 1
      }
    }
    that.setData({
      list
    })
    that.showModal()
  },

})