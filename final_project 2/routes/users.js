var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO');

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // var sess = req.session;

  userDAO.getByUsername(username, function (user) {
    if(user.length==0){
      res.json({msg:'用户不存在！请先注册'});

    }else {
      console.log("stop",user[0].stopflag)
      if(user[0].stopflag==1){
        res.json({msg:'对不起，用户已被停用'});
      }
      if(password===user[0].password){
        req.session['username'] = username;
        res.cookie('username', username);
        res.json({msg: 'ok'});
        // res.json({msg:'ok'});
      }else{
        res.json({msg:'用户名或密码错误！请检查输入是否有误'});
      }
    }
  });
});


/* add users */
router.post('/register', function (req, res) {
  var add_user = req.body;
  // 先检查用户是否存在
  userDAO.getByUsername(add_user.username, function (user) {
    if (user.length != 0) {
      // res.render('index', {msg:'用户不存在！'});
      res.json({msg: '用户已存在！'});
    }else {
      userDAO.add(add_user, function (success) {
        res.json({msg: '成功注册！请登录'});
      })
    }
  });

});
//停用用户
router.post('/stop', function (req, res) {
  var stop_user = req.body;
  // 先检查用户是否存在
  userDAO.getByUsername(stop_user.username, function (user) {
    console.log("user",user[0])
    console.log(user[0].stopflag)
    if (user[0].stopflag == 1) {
      // res.render('index', {msg:'用户不存在！'});
      res.json({msg: '用户已停用,无需重复停用！'});
    }else {
      userDAO.stop(stop_user.username,function(success){
        res.json({msg: '停用用户成功！'})
      })
      
    }
  });

});
//启用用户
router.post('/start', function (req, res) {
  var start_user = req.body;
  // 先检查用户是否存在
  console.log(start_user);
  userDAO.getByUsername(start_user.username, function (user) {
    console.log("user",user[0])
    if (user[0].stopflag == 0) {
      // res.render('index', {msg:'用户不存在！'});
      res.json({msg: '用户已为启用状态,无需重复启用！'});
    }else {
      userDAO.start(start_user.username,function(success){
        res.json({msg: '启用用户成功!'})
      })
      
    }
  });

});
router.get('/check', function(req, res,next) {
  console.log(req.session['username']);
  //sql字符串和参数
  if (req.session['username']===undefined) {
      // response.redirect('/index.html')
      res.json({msg:'url',result:'/index.html'});
  }
  else if (req.session['username']=='wwq') {
      res.json({msg:"欢迎您，管理员wwq"});
      // response.redirect('/index.html')
  }else {
      res.json({msg:"对不起，您不是管理员，您无法访问后台管理界面"})
     
  }
});
// 退出登录
router.get('/logout', function(req, res, next){
  // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
  // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
  // 然后去查找对应的 session 文件，报错
  // session-file-store 本身的bug

  req.session.destroy(function(err) {
    if(err){
      res.json('退出登录失败');
      return;
    }

    // req.session.loginUser = null;
    res.clearCookie('username');
    res.json({result:'/index.html'});
  });
});

module.exports = router;
