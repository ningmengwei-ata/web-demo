var mysql = require('mysql');
var mysqlConf = require('../conf/mysqlConf');
var pool = mysql.createPool(mysqlConf.mysql);
// 使用了连接池，重复使用数据库连接，而不必每执行一次CRUD操作就获取、释放一次数据库连接，从而提高了对数据库操作的性能。

var Segmenter = require('node-analyzer');
module.exports = {
    query_noparam :function(sql, callback) {
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log(err);
                callback(err, null, null);
            } else {
                conn.query(sql, function(qerr, vals, fields) {
                    conn.release(); //释放连接
                    callback(qerr, vals, fields); //事件驱动回调
                });
            }
        });
    },
    query :function(sql,param, callback) {
        pool.getConnection(function(err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql,param, function(qerr, vals, fields) {
                    console.log(sql);
                    console.log(param);
                    conn.release(); //释放连接
                    callback(qerr, vals, fields); //事件驱动回调
                });
            }
        });
    },
    search :function(searchparam, callback) {
        // 组合查询条件
        if(searchparam['sscore']=="undefined"){
        var sql = 'select * from fetches ';
        }else{
            var sql ='select * from fetches,Score ';
        }
        console.log(searchparam["ss"]);
        // var segmenter = new Segmenter();
        
        // console.log("t",searchparam["t"]);
        

        if(searchparam["t2"]!="undefined"){
            sql +=(`where title like '%${searchparam["t1"]}%' ${searchparam['ts']} title like '%${searchparam["t2"]}%' `);
        }else if(searchparam["t1"]!="undefined"){
            sql +=(`where title like '%${searchparam["t1"]}%' `);
        };

        if(searchparam["t1"]=="undefined"&&searchparam["t2"]=="undefined"&&searchparam["c1"]!="undefined"){
            sql+='where ';
        }else if(searchparam["t1"]!="undefined"&&searchparam["c1"]!="undefined"){
            sql+='and ';
        }

        if(searchparam["c2"]!="undefined"){
            sql +=(`content like '%${searchparam["c1"]}%' ${searchparam['cs']} content like '%${searchparam["c2"]}%' `);
        }else if(searchparam["c1"]!="undefined"){
            sql +=(`content like '%${searchparam["c1"]}%' `);
        }
        
        if(searchparam["c1"]=="undefined"&&searchparam["c2"]=="undefined"&&searchparam["t1"]=="undefined"&&searchparam["t2"]=="undefined"&&searchparam["k1"]!="undefined"){
            sql+='where ';
        }else if((searchparam["t1"]!="undefined"||searchparam["c1"]!="undefined")&&searchparam["k1"]!="undefined"){
            sql+='and ';
        }

        if(searchparam["k2"]!="undefined"){
            sql +=(`keywords like '%${searchparam["k1"]}%' ${searchparam['ks']} keywords like '%${searchparam["k2"]}%' `);
        }else if(searchparam["k1"]!="undefined"){
            sql +=(`keywords like '%${searchparam["k1"]}%' `);
        }
        console.log(searchparam["ss"]);
        if(searchparam["c1"]=="undefined"&&searchparam["c2"]=="undefined"&&searchparam["t1"]=="undefined"&&searchparam["t2"]=="undefined"&&searchparam["k1"]=="undefined"&&searchparam["k2"]=='undefined'&&searchparam["ss"]!='undefined'){
            sql+='where ';
            console.log("yes!")
        }else if((searchparam["t1"]!="undefined"||searchparam["c1"]!="undefined"||searchparam["k1"]!="undefined")&&searchparam["ss"]!="undefined"){
            sql+='and ';
        }
        if(searchparam["ss"]=="undefined"){
            // sql +=(`*****`);
            console.log("*****")
        }
        if(searchparam["ss"]!="undefined"){
            console.log("source")
            sql +=(`source_name = '${searchparam["ss"]}'`);
            console.log(sql)
        }
        // if(searchparam["t"]!="undefined"){
        //     if(searchparam["t"].length<=3){
        //         sql+=(`where id_fetches in (select id_fetches from WordSplit where word like '${searchparam["t"]}')`);
        //     }else{
        //         var newcontent = searchparam["t"].replace(regex,'');
        //         var words = segmenter.analyze(newcontent).split(' ');
        //         var n=1;
        //         //默认第一个分词词语是有效词，像“的”这样的无效词一般出现在词语之间
        //         sql+=(`where id_fetches in (select id_fetches from(select id_fetches from WordSplit where word like '${words[0]}'`);
        //         for(var i=1;i<words.length;i++){
        //             if(!stop_words.has(words[i])&&words[i].length>1){
        //                 sql+=(` UNION ALL select id_fetches from WordSplit where word like '${words[i]}'`);
        //                 n++;
        //             }                   
        //         }
        //         sql+=`)a GROUP BY id_fetches HAVING COUNT(*) = ${n})`; 
        //     }
             
        // }

        if(searchparam['stime']!="undefined"){
            if(searchparam['stime']=="1"){
                sql+='ORDER BY publish_date ASC ';
            }else {
                sql+='ORDER BY publish_date DESC ';
            }
        }
       

        if(searchparam['sscore']!="undefined"){
            sql+='fetches.id_fetches=Score.id_fetches '
         if(searchparam['stime']=="undefined"){
            sql+='ORDER BY weight DESC ';
         }
         else{
            sql+=',weight DESC';
         }
              
            
        }

        sql+=';';
        console.log(searchparam["ks"]);
        console.log(sql)
        pool.getConnection(function(err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, function(qerr, vals, fields) {
                    conn.release(); //释放连接
                    callback(qerr, vals, fields); //事件驱动回调
                });
            }
        });
    },


};
