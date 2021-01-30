Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },
  methods: {
    getWeek(date) { //获取星期
      let weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      return weekArray[date.getDay()];
    },
    dayScroll(e) { //滑动至某个区间时显示当前的月份
      let that = this
      const scrollLeftArray = that.data.scrollLeftArray;
      console.log(e.detail.scrollLeft)
      let dayScrollLeft = e.detail.scrollLeft;
      if (dayScrollLeft < scrollLeftArray[0] - 100) {
        that.setData({
          showCurrentMonth: that.data.month
        })
      } else if (that.data.day < 7) {
        if (e.detail.scrollLeft > scrollLeftArray[2] - (7 - that.data.day) * 100) {
          that.setData({
            showCurrentMonth: that.data.month + 2
          })
        }
      } else if (that.data.day >= 7) {
        if (e.detail.scrollLeft > scrollLeftArray[2]) {
          that.setData({
            showCurrentMonth: that.data.month + 2
          })
        }
      } else {
        that.setData({
          showCurrentMonth: that.data.month + 1
        })
      }
    },
    getAfterDay() {
      let that = this;
      // let now = new Date(),
      let now = date_it
      month = now.getMonth(),
        weekday = that.getWeek(now),
        day = now.getDate(),
        prevMonth = month == 0 ? 11 : month - 1,
        nextMonth = month == 11 ? 0 : month + 1,
        lastDay = new Date((new Date().setMonth(month + 1, 1) - 1000 * 60 * 60 * 24)).getDate(), //获取当月最后一天日期;
        prevLastDay = new Date((new Date().setMonth(month, 1) - 1000 * 60 * 60 * 24)).getDate(); //获取上一个月最后一天日期; 

      console.log(now, "年月日");
      console.log(month, "当月");
      console.log(weekday, "当周几");
      console.log(day, "当天");
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
      that.setData({
        day: day,
        month: month,
        weekday: weekday,
        showCurrentMonth: month + 1,
        prevMonthDateArray: prevMonthDateArray,
        currentMonthDateArray: currentMonthDateArray,
        nextMonthDateArray: nextMonthDateArray
      })
      //获取左边距是为了滑动时改变月份
      const query = wx.createSelectorQuery();
      let scrollLeftArray = [];
      query.selectAll(`#day${month + 1}1, #day${month + 1}${day}, #day${month + 2}1`).boundingClientRect(function (rects) {
        rects.forEach(function (rect) {
          scrollLeftArray.push(rect.left)
        })
        that.setData({
          scrollLeftArray: scrollLeftArray,
          scrollLeftInit: scrollLeftArray[1] - 100
        })
        console.log(scrollLeftArray)
      }).exec()
    }
  }
})