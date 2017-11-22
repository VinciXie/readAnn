
function vertexs2featureCoord(vertexs) {
  let coord = [];
  vertexs.forEach(vertex => {
    let x = Number(vertex.getAttribute('X'))
    let y = -vertex.getAttribute('Y');
    coord.push([x, y])
  })
  return coord
}

function coord2polygon(coord) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([coord]),
  });
  return feature
}

function coord2point(coord) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coord),
  });
  return feature
}

function parseAnno(doc) {
  let regions = doc.querySelectorAll('Region');
  // console.log('regions', regions);
  let annoArr = [];
  for (let region of regions) {
    // let id = region.getAttribute('Id')
    let vertexs = region.querySelectorAll('Vertex');
    let coord = vertexs2featureCoord(vertexs);
    annoArr.push(coord)
  }
  return annoArr
}

function toPolygon(arr) {
  let features = arr.map(coord2polygon)
  // console.log('features', features);
  return features
}

function toPoint(arr) {
  let features = arr.map(coord2point)
  // console.log('features', features);
  return features
}

var FeaFactory = {
  parseAnno,
  toPolygon,
  toPoint,
}

module.exports = FeaFactory;
