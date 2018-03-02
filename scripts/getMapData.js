var curl = require('curl');
var request = require('async-request');
var fs = require('fs');
var path = require('path');

var locales = {};
var islands = {};

curl.get('http://maps.durango.nexon.com/static/app.js', {}, async (err, response, body) => {
  body = body.replace(/(\r|\n)/g,'');

  // i18n 텍스트 추출
  var matches = body.match(/localized_text = \{([^\}]*)\}/i)[1];
  matches.split(',').forEach(kv => {
    var [k,v] = kv.split(':').map(v => v.replace(/'/g,'').trim());
    if(k && v){
      locales[k] = v;
    }
  });

  // 섬목록 추출
  var regex = /lists\['urban'\]\['([a-z0-9-_]*)'\] \+= '<a href="\/([a-zA-Z0-9-_]*)">([^\]]*)Lv. ([0-9]{1,2})/g;
  var matches = body.match(regex);
  var islandCodes = matches.map(v => v.replace(regex, '$1|$4|$2').split('|'));

  for(var i=0;i<islandCodes.length;i++){
    var [urban, level, code] = islandCodes[i];

    // 해당 맵의 타임스탬프 추출
    var res = await request('http://maps.durango.nexon.com/' + code, {method:'GET'});
    var matches = res.body.replace(/(\r|\n)/g, '').match(/timeline: \[([^\]]*), \]/i)[1].replace(/['\s]/g,'').split(',');
    var timestamp = matches[matches.length-1];

    if (!islands[urban]) {
      islands[urban] = [];
    }
    islands[urban].push({
      level: parseInt(level),
      code: code,
      name: locales[code],
      timestamp: timestamp,
    });
  };

  // JSON 파일 생성
  fs.writeFileSync(path.join( __dirname, '../src/data/islands.js'),
    'module.exports=' + JSON.stringify(islands));
});

