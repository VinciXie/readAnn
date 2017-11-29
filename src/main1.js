const FeaFactory = require('./js/FeaFactory.js');
const Vector = require('./js/layer.js');
const XML_Parser = require('./js/parseXML.js');
const { getResult } = require('./js/result.js');
const { getTime } = require('./lib/time.js');

const fs = require('fs');
const path = require('path');

const imgsdir = path.join(__dirname, '../out_images/');
// const imgsdir = path.join(__dirname, '../out_images2/');
const annodir = path.join(__dirname, '../Annotations/');

let files = fs.readdirSync(imgsdir);
let filenames = [];
for (let name of files) {
  if (name.startsWith('.')) {
    // console.log('name', name);
  } else {
    filenames.push(name.split('.')[0])
  }
}

console.log('filenames num', filenames.length);

function makeJSON() {
  let labelsPath = path.join(__dirname, `../labels`)
  if (!fs.existsSync(labelsPath)) {
    fs.mkdirSync(labelsPath)
  }
  for (var i = 0; i < filenames.length; i++) {
    let t1 = getTime()
    let name = filenames[i];

    // 先取得这个文件的 xml
    const doc = XML_Parser.XML2DOC(annodir, name);
    // 提取 xml 的信息生成 feature
    let marks = XML_Parser.parseDOC(doc);
    let features = FeaFactory.toPolygon(marks);
    Vector.polygonSource.clear(true)
    Vector.addFeatures(features)

    var {result} = getResult(Vector);
    // console.log('result 0 ', result[0]);

    fs.writeFileSync(labelsPath + `/${name}.json`, JSON.stringify(result))
    console.log('The file has been saved!', name, (getTime() - t1) / 1000 + 's');
    // break
  }
  console.log('successed!!!!!');
}


let btn_json = document.querySelector('.make-json')
btn_json.onclick = makeJSON
