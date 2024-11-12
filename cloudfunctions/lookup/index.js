// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

     if (!event.match_name) {
      //  如果没有match
      return await db.collection(event.name).aggregate()
      .lookup({
          from: event.from,
          localField:event.localField,
          foreignField:event.foreignField,
          as:event.as,
      })
      
      .end()
     }else{
      return await db.collection(event.name).aggregate()
      .lookup({
          from: event.from,
          localField:event.localField,
          foreignField:event.foreignField,
          as:event.as,
      })
      .match({
          [event.match_name]: event.match_value
      })
      .end()
     }
        
}