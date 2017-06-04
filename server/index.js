var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var i = 0;
//QQ音乐歌手列表页
var url = 'https://y.qq.com/portal/singer_list.html';
var page = '';
var status = 'waiting';
var count = 0;

//主程序开始
getPage(url);

function getPage(url) {
  https.get(url, function (res) {
    console.log('get success...');
    res.setEncoding('utf-8');
    res.on('data', function (chunk) {
      page += chunk;
    });
    res.on('end', function () {
      status = 'end';
      console.log(page);
      resolvePage(page);
      count = count + 1;
      if(count < 2) {
        getPage(url);
      }
    });
    res.on('error', function () {
      status = 'error';
      console.log('http get error...')
    })
  })
}

// 解析html
function resolvePage(page) {
  if (page) {
    var $ = cheerio.load(page);
    //歌手标签
    //var singerTag = getSingerTag($);
    //歌手列表
    var singerList = getSingerList($);
  } else {
    return null;
  }
}
//解析歌手标签
function getSingerTag($) {
  var singerTag = {};
  var singerTagAreas = [];
  var singerTagLetters = [];
  $('div.main div.mod_singer_tag div.js_area a').each(function () {
    var tagName = $(this).text();
    var dataKey = $(this).attr('data-key');
    singerTagAreas.push({ tagName: tagName, dataKey: dataKey });
  });
  $('div.main div.mod_singer_tag div.js_letter a').each(function () {
    var tagName = $(this).text();
    var dataKey = $(this).attr('data-key');
    singerTagLetters.push({ tagName: tagName, dataKey: dataKey });
  });
  singerTag.singerTagAreas = singerTagAreas;
  singerTag.singerTagLetters = singerTagLetters;
  console.log(singerTag);
  return singerTag;
}
//解析歌手列表
function getSingerList($) {
  var singerList = {};
  var modSingerList = [];
  var textSingerList = [];
  $('div.main div#mod-singerlist ul.js_avtar_list').each(function () {
    var aHref = $(this).find('a.singer_list__cover').attr('href');
    var aImgSrc = $(this).find('img').attr('src');
    var h3AHref = $(this).find('h3 a').attr('href');
    var h3AText = $(this).find('h3 a').text();
    modSingerList.push({
      aHref: aHref,
      aImgSrc: aImgSrc,
      h3AHref: h3AHref,
      h3AText: h3AText
    });
  });
  $('div.main div#mod-singerlist ul.singer_list_txt').each(function () {
    var LiAhref = $(this).find('a').attr('href');
    var LiAText = $(this).find('a').text();
    textSingerList.push({
      LiAhref: LiAhref,
      LiAText: LiAText
    });
  });
  singerList.modSingerList = modSingerList;
  singerList.textSingerList = textSingerList;
  console.log(singerList);
  return singerList;
}

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


