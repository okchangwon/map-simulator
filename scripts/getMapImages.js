var request = require('async-request');
var download = require('image-downloader');
var fs = require('fs');
var path = require('path');
var islands = require('../src/data/islands.js');

var mapColumnCount = 41;
var mapRowCount = 41;
var staticImagePath = 'https://d2tc3yqdqbpwb8.cloudfront.net/{mapcode}/{timestamp}/2/{x}_{y}.jpeg';

// 맵 루프 돌기
(async function(){
  for(var category in islands){
    for(var i=0;i<islands[category].length;i++){
      var {code, name} = islands[category][i];

      console.log(category + ' / ' + name);

      await downloadMapImages(category, code);
    }
  }
})();

async function downloadMapImages(category, code){
  // 해당 맵의 타임스탬프 추출
  var response = await request('http://maps.durango.nexon.com/' + code, {method:'GET'});
  var body = response.body.replace(/(\r|\n)/g, '');

  var matches = body.match(/timeline: \[([^\]]*), \]/i)[1].replace(/['\s]/g,'').split(',');
  var timestamp = matches[matches.length-1];

  // 이미지 URL 목록 추출
  var urls = createMapImageUrls(code, timestamp);
  var staticMapPath = path.join( __dirname, '../static/map/'+category );

  if(!fs.existsSync(staticMapPath)){
    fs.mkdirSync(staticMapPath);
  }

  staticMapPath += '/' + code;

  if(!fs.existsSync(staticMapPath)){
    fs.mkdirSync(staticMapPath);
  }else{
    // return;
  }

  for(var i=0;i<urls.length;i++){
    try {
      var { filename, image } = await download.image({url: urls[i], dest: staticMapPath});

      console.log('success : ', filename);
    }catch(e){
      //console.log('failed : ', urls[i]);
    }
  }
}

function createMapImageUrls(mapcode, timestamp){
  var urls = [];
  for(var i=0;i<mapColumnCount;i++){
    for(var j=0;j<mapRowCount;j++){
      var url = staticImagePath
        .replace('{mapcode}', mapcode)
        .replace('{timestamp}', timestamp)
        .replace('{x}', i)
        .replace('{y}', j);

      urls.push(url);
    }
  }
  return urls;
}
