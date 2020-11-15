// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//云数据库初始化
const db = cloud.database()
const rp = require('request-promise')
const MAX_LIMIT = 100
const BASE_URL = 'http://musicapi.xiecheng.live'
const MY_BASE_URL = 'http://music.liaohuabiao.com:3001/'
const myplaylist = db.collection("myplaylist")
const toplist = db.collection("toplist")
const topinfo = db.collection("topinfo")
const songlist = db.collection("songlist")
const TcbRouter = require('tcb-router')
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      }).catch((err) => {
        return {
          data: []
        }
      })
    await next()
  })

  // app.router('getSongList', async (ctx, next) => {
  //   await rp(MY_BASE_URL + 'getSongList?disstid=' + event.disstid).then(async (res) => {
  //     // 20
  //     let data = JSON.parse(res).data
  //     for (let j = 0; j < data.length - 1; j++) {
  //       //添加数据，一次只能添加一条
  //       await songlist.add({
  //         data: {
  //           ...data[j],
  //           sid: event.disstid,
  //           createTime: db.serverDate()
  //         }
  //       })

  //     }
  //   })
  // })
//myplaylist
  app.router('myplaylist', async (ctx, next) => {
    ctx.body = await myplaylist
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      }).catch((err) => {
        return {
          data: []
        }
      })
    await next()
  })

  // http://music.liaohuabiao.com:3001/getSongList?disstid=7562760613
  app.router('mytoplist', async (ctx, next) => {
    ctx.body = await toplist
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'asc')
    .get()
    .then((res) => {
      return res
    }).catch((err) => {
      return {
        data: []
      }
    })
    await next()
  })
  app.router('mytopInfo', async (ctx, next) => {
    ctx.body = await topinfo.where({
      topId: parseInt(event.id)
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'desc')
    .get()
    .then((res) => {
      return res
    }).catch((err) => {
      return {
        data: []
      }
    })
    await next()
  })
  app.router('mysonglist', async (ctx, next) => {
    // 先取出集合记录总数
    //   let ret =await myplaylist
    //   .skip(0)
    //   .limit(100)
    //   .orderBy('createTime', 'desc')
    //   .get()
    //   .then((res) => {
    //     return res
    //  }).catch((err) => {
    //    return {
    //      data: []
    //    }
    //  })
    //  let disstidArr =  ret.data.map(item=>{
    //    return item.dissid
    //  })
    //  for(let i =5; i< disstidArr.length-1;i++){
    //   await rp(MY_BASE_URL + 'getSongList?disstid='+disstidArr[i]).then(async (res) => {
    //     // 20
    //     let data = JSON.parse(res).data
    //     for(let j =0; j< data.length -1;j++){
    //           //添加数据，一次只能添加一条

    //             await songlist.add({
    //               data: {
    //                 ...data[j],
    //                 sid: disstidArr[i],
    //                 createTime: db.serverDate()
    //               }
    //             })

    //     }
    //   })
    //  }
    //ctx.body = disstidArr

    // //10

    ctx.body = await songlist.where({
      sid: event.disstid
    }).skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      }).catch((err) => {
        return {
          data: []
        }
      })
    await next()

  }

  )
  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        // 2451836751
        return JSON.parse(res)
      }).catch((err) => {
        return {
          data: []
        }
      })
  })

  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`).then((res) => {
      return res
    })
  })

  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then((res) => {
      return res
    })
  })

  app.router('topList', async (ctx, next) => {
    ctx.body = await rp(MY_BASE_URL + "getTopList")
      .then(async (res) => {
        return JSON.parse(res).data
      }).catch((err) => {
        console.log(err)
        return err
      })
  })

  app.router('topInfo', async (ctx, next) => {
    console.log(event.id)
    ctx.body = await rp(MY_BASE_URL + "getTopInfo?topid=" + event.id)
      .then((res) => {

        return JSON.parse(res).data.slice(0, 20)
      }).catch((err) => {
        console.log(err)
        return {
          data: []
        }
      })
  })
  app.router('musicTopUrl', async (ctx, next) => {
    console.log(event)
    ctx.body = await rp("http://music.liaohuabiao.com:3001/getMusicAddress?mid=" + event.id)
      .then((res) => {
        return JSON.parse(res)
      }).catch((err) => {
        console.log(err)
        return {
          data: []
        }
      })
  })

  app.router('musicTopLyric', async (ctx, next) => {
    console.log(event)
    ctx.body = await rp("http://music.liaohuabiao.com:3001/getMusicLyric?mid=" + event.id)
      .then((res) => {

        return JSON.parse(res)
      }).catch((err) => {
        console.log(err)
        return {
          data: []
        }
      })
  })

  return app.serve()
}