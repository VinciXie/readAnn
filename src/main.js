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

let name = filenames[0];

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

let annoJSONFilePath = path.join(annodir, `${name}.json`);

if ( !fs.existsSync( annoJSONFilePath ) ) {
  console.log('json 文件不存在，读取 xml');
  // 先取得这个文件的 xml
  var doc = XML_Parser.XML2DOC(annodir, name);
  var mpp = doc.querySelector('Annotations').getAttribute('MicronsPerPixel');

} else {

  var anno = fs.readFileSync(annoJSONFilePath, 'utf8');
  anno = JSON.parse(anno);
  var mpp = anno.mpp
}
// 再取得这个图像，并生成 ol
const map = readImage(name);
// console.log('map', map);
const _map = map.map;

_map.addLayer(Vector.layerGroup);

_map.on('click', function (e) {
  // console.log('e', e);
  let coordinate = e.coordinate
  // console.log('coordinate', coordinate);
  let callback = function (f) {
    console.log('f', f);
    // return f
  }
  // let geo = oneFeature.getGeometry();
  // console.log('geo', geo);
  // console.log('isIn', geo.intersectsCoordinate(coordinate));
  // console.log('this.renderer_', this.renderer_);
  // let hitTolerance = 0;
  // let fffs = this.renderer_.forEachFeatureAtCoordinate(
  //     coordinate, this.frameState_, hitTolerance, callback, null,
  //     function () { return true }, null)
  // console.log('fffs', fffs);
  // console.log(this,
  //   this.hasFeatureAtPixel(pixel)
  // );
})

// 提取 xml 的信息生成 feature
if ( !fs.existsSync( annoJSONFilePath ) ) {
  console.log('json 文件不存在，读 doc，写入文件');
  var marks = XML_Parser.parseDOC(doc);
  let annoJSON = {
    mpp,
    marks
  }
  fs.writeFile(annoJSONFilePath, JSON.stringify(annoJSON), function (err) {
    if (err) throw err;
    console.log('写入成功');
  })
} else {
  var marks = anno.marks;
}

console.log('marks.length', marks.length);
let polygons = FeaFactory.toPolygons(marks);
// let oneFeature = new ol.Feature(new ol.geom.GeometryCollection(polygons));
let features = polygons.map(p => new ol.Feature(p))
// let features = FeaFactory.toPolygon([
//   [[10, -10], [100, -10], [100, -100], [10, -100]],
//   [[50, -10], [150, -10], [150, -100], [50, -100]]
// ]);
Vector.addFeatures(features)
// Vector.addFeature(oneFeature)
// console.log('features', features);


var {result, p_matrix} = getResult(Vector);
console.log('result 0 ', result[0]);
// console.log('p', p_matrix);
// let pointFeatures = FeaFactory.toPoint(p_matrix);
// Vector.addPoints(pointFeatures)


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
  let url = imgsdir + name + '.jpeg';
  let source = map.imageLayer.getSource();
  // console.log('map.imageLayer.getSource()', map.imageLayer.getSource());
  // console.log('getAttributions', source.getAttributions());
  // console.log('getKeys', source.getKeys());
  // console.log('getProperties', source.getProperties());
  // console.log('get url', source.get("url"));
  //
  // source.once('propertychange', function (e) {
  //   console.log('propertychange e ', e);
  // })
  // source.set('url', url)
  map.imageLayer.setSource( new ol.source.ImageStatic({
    url,
    projection: map.projection,
    imageExtent: OpenLayer.extent
  }) )
}
