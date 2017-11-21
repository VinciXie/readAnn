// const openLayer = require('./map');
const OpenLayer = require('./map');
const { feaFactory } = require('./readAnno');

const fs = require('fs');
const path = require('path');

const imgsdir = path.join(__dirname, '../out_images/');
const annodir = path.join(__dirname, '../Annotations/');

let filenames = fs.readdirSync(imgsdir);
filenames = filenames.map(name => name.slice(0, -5))
// console.log('filenames', filenames);
const extent = [0, 0, 1000, 1000]

let name = filenames[0];

function getXML(name) {
  let annPath = annodir + name + '.xml';
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
const _map = map.map

// 提取 xml 的信息生成 feature
let features = feaFactory(doc);
// console.log('features', features);

let source = new ol.source.Vector();
let Vector = new ol.layer.Vector({
  source,
  extent
});
source.addFeatures(features)
_map.addLayer(Vector)

_map.on('click', function (e) {
  console.log('e', e);
  let coordinate = e.coordinate

})
