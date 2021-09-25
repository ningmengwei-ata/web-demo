var newsDAO = require('/Users/wangwenqing/Desktop/web编程/final_project 2/dao/newsDAO.js');
var fetchGetSql = 'select id_fetches,word from WordSplit;';
newsDAO.query_noparam(fetchGetSql, function(err, result){
    var tn;
    var getTotalNum = 'select count(distinct id_fetches) as num from WordSplit;';
    newsDAO.query_noparam(getTotalNum, function(err,res){
        tn = res[0].num;
        //文档总数
        result.forEach(function(item){
            var id=item.id_fetches;
            var word=item.word; 
            var tf1;
            //该文档中word出现的次数
            var gettf1=`select count(*) as num from WordSplit where word='${word}' and id_fetches=${id};`
            newsDAO.query_noparam(gettf1, function(err,res){
                tf1=res[0].num;    

                var tf2;
                //该文档中的词条数目
                var gettf2=`select count(*) as num from WordSplit where id_fetches=${id};`
                newsDAO.query_noparam(gettf2, function(err,res){
                    tf2=res[0].num;  
                    var tf=tf1/tf2;
                    
                    var idf2;
                    //包含词条t的文档数
                    var getidf2=`select count(distinct id_fetches) as num from WordSplit where word='${word}';`
                    newsDAO.query_noparam(getidf2, function(err,res){
                        idf2=res[0].num;   
                        var weight=tf*Math.log(tn/idf2);
                        if(weight!=undefined){
                            //写入带权重的数据表
                            console.log(weight);
                            var insert_word_Sql = 'INSERT INTO Score(id_fetches,word,weight) VALUES(?,?,?);';
                            var insert_word_Params = [id,word,weight];
                            newsDAO.query(insert_word_Sql, insert_word_Params, function(err){ 
                                if(err)console.log(err);
                            });
                        }
                    });
                });
            });
        });    
    });    
});

