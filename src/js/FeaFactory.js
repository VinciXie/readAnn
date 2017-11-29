// const ol = require('openlayers');
const {geom, Feature} = require('openlayers');
// console.log('Feature', Feature);

function coord2polygon(coord) {
  var feature = new Feature({
    geometry: new geom.Polygon([coord]),
  });
  return feature
}

function coord2point(coord) {
  var feature = new Feature({
    geometry: new geom.Point(coord),
  });
  return feature
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
  toPolygon,
  toPoint,
}

module.exports = FeaFactory;
