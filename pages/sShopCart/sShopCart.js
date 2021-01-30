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
    it_cloose: false,
    all_cloose: false, //全
    shopList: [],
    idList: [],
    orderTotal: 0,
    is_del: false,

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      // order_id: options.order_id,
    })
    that.getShopList()
  },
  onShow: function () {},
  goback() {
    wx.navigateBack()
  },
  async getShopList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_cart/getlists',
        method: 'GET'
      })
      console.log(data);
      if (data.goods_list.length != 0) {
        data.goods_list.forEach(item => {
          item.is_cloose = 0
        });
        that.setData({
          it_cloose: false
        })
      } else {
        that.setData({
          it_cloose: true
        })
      }
      that.setData({
        shopList: data.goods_list,
      })

    } catch (err) {
      console.log(err);
      let msg = err.msg
      a.popTest(msg)

    }
  },
  async onClickMinus(e) { // 递减购物车
    let that = this
    let goods_id = e.currentTarget.dataset.goods_id
    let goods_sku_id = e.currentTarget.dataset.goods_sku_id
    let new_obj = goods_id + '_' + goods_sku_id
    console.log(new_obj);
    let shopList = that.data.shopList
    let inf = shopList[e.currentTarget.dataset.index].total_num
    console.log(inf);
    if (inf != 1) {
      try {
        const {
          data
        } = await request({
          url: 'api/litestore.litestore_cart/dec',
          data: {
            goods_id: goods_id,
            goods_sku_id: goods_sku_id
          }
        })
        console.log(data);
        if (data.code == 1) {
          shopList.forEach(it => {
            let on_obj = it.goods_id + '_' + it.goods_sku_id
            if (on_obj == new_obj) {
              it.total_num -= 1
            }
          })
          that.getTotalPrice()
          that.setData({
            shopList
          })
        }
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    } else {

      that.delStore(goods_id, goods_sku_id)
    }

  },
  async onClickAdd(e) { // 递增购物车
    let that = this
    let goods_id = e.currentTarget.dataset.goods_id
    let goods_sku_id = e.currentTarget.dataset.goods_sku_id
    let new_obj = goods_id + '_' + goods_sku_id
    let shopList = that.data.shopList
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_cart/inc',
        data: {
          goods_id: goods_id,
          goods_sku_id: goods_sku_id
        }
      })
      console.log(data);
      if (data.code == 1) {
        shopList.forEach(it => {
          let on_obj = it.goods_id + '_' + it.goods_sku_id
          console.log(on_obj);
          if (on_obj == new_obj) {
            it.total_num += 1
          }
        })
        that.getTotalPrice()
        that.setData({
          shopList
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getTotalPrice() {
    let that = this
    let idList = that.data.idList
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/litestore.litestore_cart/getPrice',
        method: 'POST',
        data: idList
      })
      console.log(data);
      that.setData({
        orderTotal: data
      })

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)

    }
  },
  async delStore(goods_id, goods_sku_id) {
    let that = this
    let ary = []
    let obj = {}
    obj.goods_id = goods_id
    obj.goods_sku_id = goods_sku_id
    ary.push(obj)
    try {
      const {
        data
      } = await request({
        url: 'api/litestore.litestore_cart/delete',
        method: 'POST',
        data: ary
      })
      console.log(data);
      a.popSuccessTest(data.msg)
      setTimeout(() => {
        that.getShopList()
      }, 800);
      that.setData({
        it_cloose: false
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async delChangeStore() {
    let that = this
    let ary = that.data.idList
    if (ary.length != 0) {
      try {
        const {
          data
        } = await request({
          url: 'api/litestore.litestore_cart/delete',
          method: 'POST',
          data: ary
        })
        console.log(data);
        a.popSuccessTest(data.msg)
        setTimeout(() => {
          that.getShopList()
        }, 800);
        that.setData({
          it_cloose: false,
          is_del: false,
          idList: []
        })
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    } else {
      a.popTest('请选择要删除的商品')
    }
  },
  radioItem(e) { // 单选
    let that = this
    let send = e.currentTarget.dataset.index
    let im_t = e.currentTarget.dataset.item
    let new_obj = im_t.goods_id + '_' + im_t.goods_sku_id
    let shopList = that.data.shopList
    let idList = that.data.idList
    shopList.forEach((item, index) => {
      if (send == index) {
        if (item.is_cloose == 0) {
          item.is_cloose = 1
          let obj = {}
          obj.goods_sku_id = item.goods_sku_id
          obj.goods_id = item.goods_id
          idList.push(obj)
        } else {
          item.is_cloose = 0
          idList.forEach((it, inde) => {
            let on_obj = it.goods_id + '_' + it.goods_sku_id
            if (on_obj == new_obj) {
              idList.splice(inde, 1)
            }
          })
        }
      }
    })
    if (idList.length == shopList.length) {
      that.setData({
        all_cloose: true
      })
    } else {
      that.setData({
        all_cloose: false
      })
    }
    if (idList.length != 0) {
      that.setData({
        is_del: true
      })
    } else {
      that.setData({
        is_del: false
      })
    }
    that.setData({
      shopList,
      idList
    })
    that.getTotalPrice()
  },
  allItem() {
    let that = this
    let idList = that.data.idList
    let shopList = that.data.shopList
    let all_cloose = that.data.all_cloose
    if (all_cloose) {
      shopList.forEach(item => {
        item.is_cloose = 0
      })
      that.setData({
        idList: [],
        shopList,
        all_cloose: false,
        is_del: false
      })
    } else {
      that.setData({
        idList: [],
      })
      shopList.forEach(item => {
        item.is_cloose = 1
        let obj = {}
        obj.goods_sku_id = item.goods_sku_id
        obj.goods_id = item.goods_id
        idList.push(obj)
      })
      that.setData({
        idList,
        shopList,
        all_cloose: true,
        is_del: true,
      })
    }
    that.getTotalPrice()
  },
  goDteails(e) {
    let goods_id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/sStoreDeatils/sStoreDetails?goods_id=' + goods_id
    })
  },
  toResult() {
    let that = this
    let idList = that.data.idList
    // let fruitsObj ={...idList};
    if (idList.length != 0) {
      wx.navigateTo({
        url: '/pages/sStoreConfirm/sStoreConfirm?idList=' + JSON.stringify(idList) + '&is_buy=1'
      })
    } else {
      let msg = '请选择要购买的商品'
      a.popTest(msg)
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
      let msg = err.msg
      a.popTest(msg)
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