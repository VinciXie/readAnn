


exports.addFeatures = function (map, features) {
  let source = new ol.source.Vector();
  let Vector = new ol.layer.Vector({
    source,
    // extent
  });
  source.addFeatures(features)
  _map.addLayer(Vector)

};
