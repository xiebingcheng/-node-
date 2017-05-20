var express = require('express')
var path = require('path')  //加入path就是为了,我们引入样式或者jquery之类的文件,node能找到他们
var bodyParser=require('body-parser') //新版的express不在和这个插件捆绑,所以要独立引入.
var serveStatic = require('serve-static') //也是新版express不和这个插件进行捆绑,要单独导入
var mongoose = require('mongoose') //连接mongodb的库文件
var _ = require("underscore")
var Movie = require('./models/movie')
var port = process.env.PORT || 80
var app = express()

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/website')  //连入本地数据库,名字 website


app.set('views', './views/pages') //设置视图根目录
app.set('view engine', 'pug') //设置模板引擎
app.use(bodyParser.urlencoded({extended: true})) //提交表单 提交的表单内容进行格式化 
//app.use(express.static(path.join(__dirname, 'public')))  //用path找文件. dirname 是当前目录的意思.
app.use(serveStatic('public'))  //这个是head.pug里面的jquery等的目录头地址

app.locals.moment = require('moment')
app.listen(port) //监听 1234 端口

console.log('website started on port' + port) //看看能否成功启动


//这个是用来添加伪数据的
//index page 设置路由
app.get('/', function (req, res) {

    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
    res.render('index', {
            title: 'web 首页',
            movies: movies
        })
    })

   
})

//detail page 设置路由
app.get('/movie/:id', function (req, res) {  //get 第一个参数是路由设置的规则,
    var id =req.params.id
    Movie.findById(id,function(err,movie){
        if(err){
            console.log(err);
        }
        res.render('detail',{
            title:'web'+movie.title,
            movie:movie
        })
    })
})

//admin page 设置路由
app.get('/admin/movie', function (req, res) { //说白了就是主地址后面带的参数
    res.render('admin', {
        title: 'web 后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
    var id =req.params.id
    if (id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'web 后台更新页',
                movie:movie
            })
        })
    }
})

//admin post movie 这个是拿到从后台admin页post过来的数据
app.post('/admin/movie/new',function(req,res){
    var id =req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(id !== undefined && id !== "" && id !== null){ //不知道为什么 不加&& id !== "" && id !== null
        Movie.findById(id,function(err,movie){
            if (err){
                console.log(err)
            }
            _movie = _.extend(movie,movieObj)
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                
                }
                res.redirect('/movie/'+movie._id)
            })
        })
    }else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })

        _movie.save(function (err,movie){
             if(err){
                    console.log(err);
                
                }
                res.redirect('/movie/'+ movie._id)
        })
    }
})

//list page 设置路由
app.get('/admin/list', function (req, res) {
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('list', {
                title: 'web 列表页',
                movies: movies
            })
    })
})



//list delete movie 这个是list删除按钮后的处理逻辑
//通过app.delete拿到从浏览器过来的删除请求
app.delete('/admin/list',function(req,res){
    //拿到药删除的id
    var  id = req.query.id
//id判断是否存在
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }else{
                //没有异常,给浏览器返回json数据 success:1
                res.json({success:1})
            }
        })
    }
})