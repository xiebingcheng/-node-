var mongoose = require('mongoose')
//拿到schemas文件夹下的movie.js模块
var MovieSchema = require('../schemas/movie')
//传入模型名字和模式
var Movie = mongoose.model('Movie',MovieSchema)

//将构造函数导出
module.exports= Movie