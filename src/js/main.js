// const openLayer = require('./map');
const OpenLayer = require('./js/map.js');
const FeaFactory = require('./js/readAnno.js');
const Vector = require('./js/layer.js');
const { getResult } = require('./js/result.js');

const fs = require('fs');
const path = require('path');

const imgsdir = path.join(__dirname, '../out_images/');
// const imgsdir = path.join(__dirname, '../out_images2/');
const annodir = path.join(__dirname, '../Annotations/');

let files = fs.readdirSync(imgsdir);
let filenames = [];
for (let name of files) {
  if (name.startsWith('.')) {
    console.log('name', name);
  } else {
    filenames.push(name.split('.')[0])
  }
}

console.log('filenames', filenames);
const extent = OpenLayer.extent;

let index = localStorage.index
// if (index >= filenames.length) {
//   index = 0
//   localStorage.index = index
// }
let name = filenames[index];

// TCGA-G9-6348-01Z-00-DX1
name = 'TCGA-G9-6348-01Z-00-DX1';
// console.log('name', name);
document.querySelector('title').innerText = name;

function getXML(name) {
  let annPath = annodir + name.split('.')[0] + '.xml';
  // console.log('annPath', annPath);
  let imgAnn = fs.readFileSync(annPath, 'utf8');
  let parser = new DOMParser();
  let doc = parser.parseFromString(imgAnn, 'application/xml');
  // console.log('doc', doc);
  return doc
}

function readImage(name) {

  let mpp = doc.querySelector('Annotations').getAttribute('MicronsPerPixel');
  // 读取图片，然后用 openLayers 加载
  let imginfo = {
    mpp,
    url: imgsdir + name + '.jpeg'
  }
  // let map = openLayer(imginfo)
  let map = new OpenLayer(imginfo)
  return map
}

// 先取得这个文件的 xml
const doc = getXML(name);
// 再取得这个图像，并生成 ol
const map = readImage(name);
// console.log('map', map);
const _map = map.map;


_map.addLayer(Vector.layerGroup);

// 提取 xml 的信息生成 feature
let annoArr = FeaFactory.parseAnno(doc);
let features = FeaFactory.toPolygon(annoArr);
Vector.addFeatures(features)
// console.log('features', features);


var {result, p_matrix} = getResult(features);
// console.log('p', p_matrix);
let pointFeatures = FeaFactory.toPoint(p_matrix);
Vector.addPoints(pointFeatures)
console.log( 'result string /n' ,result.toString());
let labelsPath = path.join(__dirname, `../labels`)

// if (!fs.existsSync(labelsPath)) {
//   fs.mkdirSync(labelsPath)
// }

// fs.writeFile(labelsPath + `/${name}.json`, JSON.stringify(result), function (err) {
//   if (err) throw err;
//   console.log('The file has been saved!');
//   localStorage.index = parseInt(index) + 1;
//   location.reload()
// })
let btn = document.querySelector('.toggle-visible')
// console.log('btn', btn);
btn.onclick = function (e) {
  // console.log('e', e);
  let visible = Vector.layerGroup.getVisible()
  Vector.layerGroup.setVisible(!visible)
}
