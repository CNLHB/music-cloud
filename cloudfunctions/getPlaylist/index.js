// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require("request-promise")

cloud.init()
//云数据库初始化
const db = cloud.database()

const URL = "http://musicapi.xiecheng.live/personalized"

const Max_LIMIT = 10

const playCollection = db.collection("playlist")

// 云函数入口函数
exports.main = async(event, context) => {
  
  // const list = await playCollection.get()
  const countResult = await playCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / Max_LIMIT)
  const tasks = []
  for(let i = 0; i< batchTimes; i++){
    let promise = playCollection.skip(i * Max_LIMIT).limit(Max_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data:[]
  }
  if(tasks.length > 0){
    list = (await Promise.all(tasks)).reduce((acc, cur)=>{
      return {
        data: acc.data.concat(cur.data)
      }
    });
  }
  //获取数据
  const playlist = await rp(URL).then(res => {
    //转成对象，获取需要的数组
    return JSON.parse(res).result
  })
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true;
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if(playlist[i].id === list.data[j].id){
        flag = false
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    //添加数据，一次只能添加一条
    await playCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log("插入成功")
    }).catch((res) => {
      console.log("err")

    })
  }
  return newData.length
}