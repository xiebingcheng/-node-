var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    //更新数据时的时间记录
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

//每次存储数据之前,都来调用一次MovieSchema()
MovieSchema.pre('save',function(next){
    //判断是否为新加数据
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next()
})

//添加静态方法,不会直接和数据库交互
MovieSchema.statics={
    //取出数据库里面的所有数据
    fetch:function(cb){
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    },
    //查询单条数据
    findById:function(id,cb){
        return this
        .findOne({_id:id})
        .exec(cb)
    }
}

//导出模式
module.exports = MovieSchema