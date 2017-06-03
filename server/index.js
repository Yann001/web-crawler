var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var i = 0;
var url = "http://jiangxi.circ.gov.cn/web/site25/tab1475/info4064640.htm";

//封装了一层函数
function fetchPage(x) {
    startRequest(x); 
}

function startRequest(x) {
  // 采用http模块箱服务器发送一次请求
  console.log('send a http get...');
  http.get(x, function (res) {
    var html = '';
    var title = [];
    res.setEncoding('utf-8');
    //监听data事件，每次取一块数据
    res.on('data', function (chunk) {
      html += chunk;
    });
    //监听end事件， 如果整个网页内容的html都获取完毕，就执行回调函数
    res.on('end', function () {
      //采用cheerio解析html
      //console.log(html);
      var $ = cheerio.load(html);
      // var time = $('.article-info a:first-child').next().text().trim();
      // console.log(time);
      var tab_content = $('#tab_content');
      var realTable = $('#tab_content .ke-zeroborder');
      console.log(realTable);

      //savedContent($, news_title);  //存储每篇文章的内容及文章标题

      //下一篇文章的url
      // var nextLink = "http://www.ss.pku.edu.cn" + $("li.next a").attr('href');
      // str1 = nextLink.split('-');  //去除掉url后面的中文
      // str = encodeURI(str1[0]);
      // //通过控制I,可以控制爬取多少篇文章.
      // if (i <= 1) {
      //   fetchPage(str);
      // }
    }).on('error', function (err) {
      console.log(err);
    });
  })
}
//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($, news_title) {
  $('.article-content p').each(function (index, item) {
    var x = $(this).text();

    var y = x.substring(0, 2).trim();

    if (y == '') {
      x = x + '\n';
      //将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
      fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  })
}

//主程序开始
fetchPage(url);
