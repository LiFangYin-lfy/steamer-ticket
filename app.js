App({
  onLaunch: function () {
    let t = this;
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        t.globalData.statusHeight = result.statusBarHeight;
      },
    })
    try {
      const res = wx.getSystemInfoSync()
    } catch (e) {
      // Do something when catch error
    }
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
  onShow: function (res) {
    console.log(res);
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  popSuccessTest(msg) {
    wx.showToast({
      title: msg,
      icon: '',
      duration: 1300,
      mask: true
    })
  },
  popTest(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1300,
      mask: true
    })
  },
  getToday() {
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    var formatDate = year + '-' + month + '-' + day
    return formatDate;
  },
  getOutDay() { //30天之后的日期
    var date1 = new Date();
    var date2 = new Date(date1);
    console.log(date1);
    console.log(date2);
    date2.setDate(date1.getDate() + 61);
    let endDate = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate()
    return endDate;
  },
  getdateRule(data) { // 中国标准时间，转换为日期格式Sat Dec 12 2020 15:40:54 GMT+0800 =》2020-12-12
    var now = data
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    var formatDate = year + '-' + month + '-' + day
    return formatDate;
  },
  getAfterDay() {
    let that = this;
    let now = new Date(),
      year = now.getFullYear(),
      month = now.getMonth(),
      weekday = that.getWeek(now);
    day = now.getDate();
    prevMonth = month == 0 ? 11 : month - 1,
      nextMonth = month == 11 ? 0 : month + 1,
      lastDay = new Date((new Date().setMonth(month + 1, 1) - 1000 * 60 * 60 * 24)).getDate(), //获取当月最后一天日期;
      prevLastDay = new Date((new Date().setMonth(month, 1) - 1000 * 60 * 60 * 24)).getDate(); //获取上一个月最后一天日期; 
    console.log(now, "年月日");
    console.log(year);
    console.log(month, "当月");
    console.log(weekday, "当周几");
    console.log(day, "当月第几天");
    console.log(prevMonth, "前一个月《10");
    console.log(nextMonth, "后一个月》10");
    console.log(lastDay, "当月最后一天日期");
    console.log(prevLastDay, "上一个月最后一天日期");
    let currentMonthDateArray = [], //当前月份的日期和星期的数据集合
      prevMonthDateArray = [], //上月日期和星期的数据集合
      nextMonthDateArray = []; //下月日期和星期的数据集合
    for (let i = 1; i <= lastDay; i++) {
      currentMonthDateArray.push({
        day: i,
        weekDay: that.getWeek(new Date(new Date().setDate(i)))
      })
    }
    for (let i = day; i <= prevLastDay; i++) {
      prevMonthDateArray.push({
        day: i,
        weekDay: that.getWeek(new Date(new Date().setMonth(month - 1, i)))
      })
    }
    for (let i = 1; i <= day; i++) {
      nextMonthDateArray.push({
        day: i,
        weekDay: that.getWeek(new Date(new Date().setMonth(month + 1, i)))
      })
    }
    console.log(weekday);
    return weekday
  },
  getWeek(date) { //获取星期
    let weekArray = ['日', '一', '二', '三', '四', '五', '六'];
    return weekArray[date.getDay()];
  },
  getnetDate(startDate, endDate, day) {
    var startDate = startDate;
    console.log(startDate);
    var endDate = endDate;
    endDate.setDate(startDate.getDate() + day);
    console.log(endDate);

    console.log((endDate.getTime() - startDate.getTime()));
    var dataArr = [];
    var weeks = ['日', '一', '二', '三', '四', '五', '六'];
    while ((endDate.getTime() - startDate.getTime()) >= 0) {
      console.log('0000');
      var year = startDate.getFullYear()
      var month = (startDate.getMonth() + 1).toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
      var day = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
      var week = weeks[startDate.getDay()];
      let ayr = {}
      ayr.date = month + '-' + day
      ayr.week = '周 ' + week
      ayr.yearDate = year + '-' + month + '-' + day
      dataArr.push(ayr)
      startDate.setDate(startDate.getDate() + 1);
    }
    // dataArr[0].week = '今天' + dataArr[0].date.slice(6, 10);
    // dataArr[1].week = '明天' + dataArr[1].date.slice(6, 10);
    // dataArr[2].week = '后天' + dataArr[2].date.slice(6, 10);
    console.log(year);
    console.log(month);
    console.log(dataArr, "日期");
    return dataArr
  },
  setIdcard(idcard) {
    let myidcard = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if (idcard == '') {
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else if (!myidcard.test(idcard)) {
      wx.showToast({
        title: '身份证号码有误',
        duration: 1000,
        icon: 'none'
      });
      return false;
    } else {
      return idcard
    }

  },
  setPhone(mobile) {
    var myreg = /^1\d{10}$/;
    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    return mobile
  },
  previewImage(e) {
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.list
    wx.previewImage({ //图片预览
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  globalData: {
    userInfo: null,
    baseUrl: 'https://beihaiwz.com/',
    // baseUrl: 'http://steamer.t.brotop.cn/',
    imagesUrl: 'https://beihaiwz.com/assets/img',
    statusHeight: 0,
  }
})