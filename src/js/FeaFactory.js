// const ol = require('openlayers');
// const {geom, Feature} = require('openlayers');
// console.log('Feature', Feature);

function coord2polygon(coord) {
  return new ol.geom.Polygon([coord])
}

function coord2point(coord) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coord),
  });
  return feature
}

/**
 * [toPolygons description]
 * @param  {[Array]} arr [description]
 * @return {[ol.geom.Polygon]}     [description]
 */
function toPolygons(arr) {
  let polygons = arr.map(coord2polygon)
  // console.log('polygon', polygon);
  return polygons
}

function toPoint(arr) {
  let features = arr.map(coord2point)
  // console.log('features', features);
  return features
}

var FeaFactory = {
  toPolygons,
  toPoint,
}

module.exports = FeaFactory;
