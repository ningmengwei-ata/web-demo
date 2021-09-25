var newsDAO = require('../dao/newsDAO');
var logDAO=require('../dao/logDAO')
var express = require('express');
var router = express.Router();

var mywordcutModule = require('./wordcut.js');
var myfreqchangeModule = require('./freqchange.js');

// var wordSplit=require('public/javascripts/stopword.js')


router.get('/search', function(request, response) {
    console.log(request.session['username']);
    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var param = request.query;
        newsDAO.search(param,function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});
router.get('/searchlog', function(request, response) {
    console.log(request.session['username']);
    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        // var param = request.query;
        logDAO.searchlog(function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});


router.get('/histogram', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select publish_date as x,count(publish_date) as y from fetches group by publish_date order by publish_date;";
        newsDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:result}));
            response.end();
        });
    }
});


router.get('/pie', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select author as x,count(author) as y from fetches group by author having y >=5;";
        newsDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:result}));
            response.end();
        });
    }
});

router.get('/line', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var keyword = '疫情'; //也可以改进，接受前端提交传入的搜索词
        var fetchSql = "select content,publish_date from fetches where content like'%" + keyword + "%' order by publish_date;";
        newsDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:myfreqchangeModule.freqchange(result, keyword)}));
            response.end();
        });
    }
});

router.get('/wordcloud', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select content from fetches;";
        newsDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:mywordcutModule.wordcut(result)}));//返回处理过的数据
            response.end();
        });
    }
});


module.exports = router;
