var fs = require("fs");
var newsDAO = require('/Users/wangwenqing/Desktop/web编程/final_project 2/dao/newsDAO.js');
var stop_words = new Set();
var Segmenter = require('node-analyzer');

var mysql = require('./mysql.js');
fs.readFile('public/javascripts/scu_stopwords.txt','utf-8', function(err, data) { 
    if(err){
        console.log(err);
    }else { 
        var all_words= data.split('\n'); 
        for(var i = 0; i < all_words.length; i++) { 
            stop_words.add(all_words[i]);
        } 
    } 
})
const regex = /[\t\s\r\n\d\w]|[\+\-\(\),\.。，！？《》@、【】"'：:%-\/“”]/g;
var fetchSql = "select id_fetches,content from fetches;";
console.log("enter stopword.js")
mysql.query_noparam(fetchSql, function (err, result, fields) {
    result.forEach(function (item){
        var segmenter = new Segmenter();
        var newcontent = item["content"].replace(regex,'');
        if(newcontent.length !== 0){
            var words = segmenter.analyze(newcontent).split(' ');
            var id_fetch = item["id_fetches"];
            words.forEach(function(word){
                if(!stop_words.has(word)&&word.length>1){
                    // var insert_word_Sql = 'INSERT INTO WordSplit(id_fetches,word) VALUES(?,?)';
                    // var insert_word_Params = [id_fetch, word];
                    // console.log(insert_word_Params);
                    // console.log(insert_word_Sql);
                    // mysql.query(insert_word_Sql, insert_word_Params, function (qerr, vals, fields) {
                    //     if(err)console.log(err);
                    // });
                    var wordSql = "insert into WordSplit (id_fetches,word) values(\'" + id_fetch + "\','" + word+"');";
                    console.log(wordSql);
                    // mysql.query(wordSql, function(err, result){ 
                    //     console.log("enter query")
                    //     if(err)
                    //     {console.log(err);
                    //     }
                //    });
            
                }                    
            });
        }
    });
});