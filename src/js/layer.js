const ol = require('openlayers');

var color = '#0000ff';

var style = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'green'
  }),
  image: new ol.style.Circle({
    radius: 2,
    fill: new ol.style.Fill({color})
  })
})

let source = new ol.source.Vector();
let layer = new ol.layer.Vector({
  source,
  // style
});
let pointLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style
});

let layerGroup = new ol.layer.Group({
  layers: [layer, pointLayer]
})

var Vector = {
  layerGroup,
  layer,
  source,
  pointLayer,
  addFeatures: function (f) {
    source.addFeatures(f)
  },
  addPoints: function (f) {
    pointLayer.getSource().addFeatures(f)
  }
}

module.exports = Vector;
