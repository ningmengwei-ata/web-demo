var nodejieba = require('nodejieba');

//正则表达式去掉一些无用的字符，与高频但无意义的词。
// const regex = /[\t\s\r\n\d\w]|[\+\-\(\),\.。，！？\\[\\] 是 和 又 在 了 # + ^ ;《》@、【】"'：:%-\/“”]/g;
const regex = /[\t\s\r\n\d\w]|[\+\-\(\),\.。，,！？（）；你 我 他 她 一 把 及 的 是 和 又 在 了 #《》@、【】"'：:%-\/“”]/g;
var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
nodejieba.load({
    stopWordDict: '/Users/wangwenqing/Desktop/web编程/final_project 2/routes/scu_stopwords.txt',
  });
var wordcut = function(vals) {
    var word_freq = {};
    vals.forEach(function (content){
        var newcontent = content["content"].replace(regex,'').replace(reg,'');
        if(newcontent.length !== 0){
            // console.log();
            
            var words = nodejieba.cut(newcontent);
            words.forEach(function (word){
                word = word.toString();
                word_freq[word] = (word_freq[word] +1 ) || 1;
            });
        };

    });
    return word_freq;
};
exports.wordcut = wordcut;

// text = nodejieba.cut('如果没有         主动调用词典函数时， 则会在第一次调用cut等功能函数时，自动载入默认词典。')
// console.log(text);