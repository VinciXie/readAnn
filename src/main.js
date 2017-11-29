// const openLayer = require('./map');
const OpenLayer = require('./js/map.js');
const FeaFactory = require('./js/FeaFactory.js');
const Vector = require('./js/layer.js');
const XML_Parser = require('./js/parseXML.js');
const { getResult } = require('./js/result.js');
// const ol = require('openlayers');

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
const extent = OpenLayer.extent;

let index = localStorage.index
// if (index >= filenames.length) {
//   index = 0
//   localStorage.index = index
// }
let name = filenames[index];

// TCGA-G9-6348-01Z-00-DX1
// name = 'TCGA-G9-6348-01Z-00-DX1';
// console.log('name', name);
document.querySelector('title').innerText = name;


function readImage(name, mpp) {

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
const doc = XML_Parser.XML2DOC(annodir, name);
// let mpp = doc.querySelector('Annotations').getAttribute('MicronsPerPixel');
// 再取得这个图像，并生成 ol
const map = readImage(name);
// console.log('map', map);
const _map = map.map;

_map.addLayer(Vector.layerGroup);

// _map.on('click', function (e) {
//   // console.log('e', e);
//   let coordinate = e.coordinate
//   console.log('coordinate', coordinate);
//   let callback = function (f) {
//     console.log('f', f);
//     // return f
//   }
//   // console.log('this.renderer_', this.renderer_);
//   let hitTolerance = 0;
//   let fffs = this.renderer_.forEachFeatureAtCoordinate(
//       coordinate, this.frameState_, hitTolerance, callback, null,
//       function () { return true }, null)
//   // console.log('fffs', fffs);
//   // console.log(this,
//   //   this.hasFeatureAtPixel(pixel)
//   // );
// })

// 提取 xml 的信息生成 feature
let marks = XML_Parser.parseDOC(doc);
let features = FeaFactory.toPolygon(marks);
// let features = FeaFactory.toPolygon([
//   [[10, -10], [100, -10], [100, -100], [10, -100]],
//   [[50, -10], [150, -10], [150, -100], [50, -100]]
// ]);
Vector.addFeatures(features)
// console.log('features', features);


var {result, p_matrix} = getResult(Vector);
console.log('result 0 ', result[0]);
// console.log('p', p_matrix);
let pointFeatures = FeaFactory.toPoint(p_matrix);
Vector.addPoints(pointFeatures)
// console.log( 'result string /n' ,result.toString());


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

let btn_toggle = document.querySelector('.toggle-visible')
// console.log('btn', btn);
btn_toggle.onclick = function (e) {
  // console.log('e', e);
  let visible = Vector.layerGroup.getVisible()
  Vector.layerGroup.setVisible(!visible)
}

let btn_next = document.querySelector('.next-image')
// console.log('btn', btn);
btn_next.onclick = function (e) {
  // console.log('e', e);
  index = localStorage.index = parseInt(localStorage.index) + 1
  name = filenames[index];
  console.log('map.imageLayer.getSource()', map.imageLayer.getSource());
  map.imageLayer.setSource( new ol.source.ImageStatic({
    url: imgsdir + name + '.jpeg',
    projection: map.projection,
    imageExtent: OpenLayer.extent
  }) )
}
