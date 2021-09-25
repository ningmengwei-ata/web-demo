// 获取关键词 疫情 随日期变化的出现次数【折线图】
var nodejieba = require('nodejieba');

//正则表达式去掉一些无用的字符。
const regex_c = /[\t\s\r\n\d\w]|[\+\-\(\),\.。，！？《》@、【】"'：:%-\/“”]/g;
var regex_d = /\w{3}\s(.*?) 2021/; //只留下日期的年月
const regex_y = /\w{1}\d{2}\:\d{2}\:\d{2}\.\d{3}\w{1}/
var freqchange = function(vals, keyword) {
    var regex_k = eval('/'+keyword+'/g');
    var word_freq = {};

    vals.forEach(function (data){
        var content = data["content"].replace(regex_c,'');
        // console.log(content)
        console.log('publish_date',data['publish_date'])
        var pattern = /\d{4}-\d{2}-\d{2}/;
        var publish_date = regex_d.exec(data['publish_date'])[1];
        // console.log(pattern.exec(data['publish_date']))
        // // if(pattern.exec(data['publish_date'])!=null){
        //     var publish_date =pattern.exec(data['publish_date']);
        // var publish_date=data['publish_date'];
            // var publish_date=data['publish_date'].replace(regex_y,'');
            console.log(publish_date)
            var freq = content.match(regex_k).length;// 直接搜这个词。或者是先分词再统计词频（可自己尝试）
            word_freq[publish_date] = (word_freq[publish_date] + freq ) || 0;
        // }
        
    });
    return word_freq;

};
exports.freqchange = freqchange;


