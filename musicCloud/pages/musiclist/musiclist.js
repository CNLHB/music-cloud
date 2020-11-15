// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
    top:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      top:options
    })
    
    if (options.top) {
      this._topList(options)
    } else {
      this._commonList(options)
    }
  },
  onReachBottom: function () {
    
    if(this.data.top.name){
      this._commonList(this.data.top)
    }else{
      this._topList(this.data.top)
    }
  },
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  _topList(options) {
    wx.showLoading({
      title: '加载中',
    })
    let itemTop = wx.getStorageSync("top");
    wx.setNavigationBarTitle({
      title: itemTop.topTitle,
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
    this.setData({
      listInfo: {
        coverImgUrl: itemTop.picUrl,
        name: itemTop.topTitle,
      }
    })

    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: 'mytopInfo',
        id: options.playlistId,
        start:Array.isArray(this.data.musicList)?this.data.musicList.length:0,
        count:20
      }
    }).then(res => {
      const pl = res.result.data
      let musicList = []
      pl.forEach((item, index) => {
        let al = [] 
        item.singer.forEach((sing=>{
          al.push({
            id: sing.id,
            mid: sing.mid,
            name:sing.name,
            picUrl:itemTop.picUrl
          })
        }))
        musicList.push({
          top:1,
          id: item.songmid,
          name: item.songname,
          alia: [],
          ar: [{
            id: item.singer[0].id,
            mid: item.singer[0].mid,
            name: item.singer[0].name
          }],
          al: al[0]
        })
      })
      let ret = this.data.musiclist.concat(musicList)
      this.setData({
        musiclist: ret,
        listInfo: {
          coverImgUrl: itemTop.picUrl,
          name: itemTop.topTitle,
        }
      })
      // let data = res.result;
      // let musicList = []
      // data.forEach((item, index) => {
      //   let al = [] 
      //   item.data.singer.forEach((sing=>{
      //     al.push({
      //       id: sing.id,
      //       mid: sing.mid,
      //       name:sing.name,
      //       picUrl:itemTop.picUrl
      //     })
      //   }))
      //   musicList.push({
      //     top:1,
      //     id: item.data.songmid,
      //     name: item.data.songname,
      //     alia: [],
      //     ar: [{
      //       id: item.data.singer[0].id,
      //       mid: item.data.singer[0].mid,
      //       name: item.data.singer[0].name
      //     }],
      //     al: al[0]
      //   })
      // })
      // this.setData({
      //   musiclist: musicList
      // })
      this._setMusiclist()
      wx.hideLoading()
    })

  },
  _commonList(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        disstid: options.playlistId,
        $url: "mysonglist",
        start: Array.isArray(this.data.musicList)?this.data.musicList.length:0,
        count:20
      }
    }).then((res) => {
      const pl = res.result.data
      let musicList = []
      pl.forEach((item, index) => {
        let al = [] 
        item.singer.forEach((sing=>{
          al.push({
            id: sing.id,
            mid: sing.mid,
            name:sing.name,
            picUrl:options.url
          })
        }))
        musicList.push({
          top:1,
          id: item.songmid,
          name: item.songname,
          alia: [],
          ar: [{
            id: item.singer[0].id,
            mid: item.singer[0].mid,
            name: item.singer[0].name
          }],
          al: al[0]
        })
      })
      let ret = this.data.musiclist.concat(musicList)
      this.setData({
        musiclist: ret,
        listInfo: {
          coverImgUrl: options.url,
          name: options.name,
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  }

})