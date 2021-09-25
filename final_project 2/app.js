var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var logDAO = require('./dao/logDAO.js');
// var fs = require('fs');//加了文件操作的模块
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flag: 'a' });//创建一个写文件流，并且保存在当前文件夹的access.log文件中

// var indexRouter = require('./routes/users');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');


var app = express();

//设置session
app.use(session({
  secret: 'sessiontest',//与cookieParser中的一致
  resave: true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
    maxAge : 1000 * 60 * 60, // 设置 session 的有效时间，单位毫秒
  },
}));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

let method = '';
app.use(logger(function (tokens, req, res) {
  console.log('打印的日志信息：');
  var request_time = new Date();
  var request_method = tokens.method(req, res);
  var request_url = tokens.url(req, res);
  var status = tokens.status(req, res);
  var remote_addr = tokens['remote-addr'](req, res);
  if(req.session){
    var username = req.session['username']||'notlogin';
  }else {
    var username = 'notlogin';
  }

  // 直接将用户操作记入mysql中
  if(username!='notlogin'){
    logDAO.userlog([username,request_time,request_method,request_url,status,remote_addr], function (success) {
      console.log('成功保存！');
    })
  }
  console.log('请求时间  = ', request_time);
  console.log('请求方式  = ', request_method);
  console.log('请求链接  = ', request_url);
  console.log('请求状态  = ', status);
  console.log('请求长度  = ', tokens.res(req, res, 'content-length'),);
  console.log('响应时间  = ', tokens['response-time'](req, res) + 'ms');
  console.log('远程地址  = ', remote_addr);
  console.log('远程用户  = ', tokens['remote-user'](req, res));
  console.log('http版本  = ', tokens['http-version'](req, res));
  console.log('浏览器信息 = ', tokens['user-agent'](req, res));
  console.log('用户 = ', username);
  console.log(' ===============',method);

}, ));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/angular', express.static(path.join(__dirname , '/node_modules/angular')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);


//  检测是否登录
// app.use(function(req, res, next) {
//   var url = req.url;
//   // 判断不拦截的路由 除/之外的都拦截
//   if ( url!='/users/login' && !req.session.username) {
//     res.redirect('/users/login');
//   }else {
//     next();
//   }
// });


// 这个中间件为什么不起作用啊
// app.use((req, res, next) => {
//   if (!req.session['username']) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
