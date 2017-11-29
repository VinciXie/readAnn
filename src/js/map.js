// TCGA-18-5592-01Z-00-DX1
const ol = require('openlayers');
// console.log(ol);
// let coordinates = vertexs2featureCoord(vertexs)
// let feature = new ol.Feature(new ol.geom.LineString(coordinates))
// console.log('feature', feature);
// source.addFeature(feature)
const extent = [0, -1000, 1000, 0]


class OpenLayer {
  constructor({url, mpp}) {
    this.url = url
    this.mpp = mpp
    // console.log('this', this);
    this.projection = this.projectionFactory(mpp);
    this.controls = this.controlsFactory();
    this.view = this.viewFactory();
    this.imageLayer = this.imageLayerFactory(url);
    this.map = this.mapFactory()
  }

  controlsFactory() {
    let mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(1),
      projection: this.projection,
    })
    let scaleLine = new ol.control.ScaleLine()
    let controls = ol.control.defaults({
      attribution: false,
      zoom: false
    }).extend([mousePositionControl, scaleLine])
    return controls
  }

  imageLayerFactory(url) {
    return new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url,
        projection: this.projection,
        imageExtent: extent
      })
    });
  }

  mapFactory() {
    return new ol.Map({
      layers: [ this.imageLayer ],
      target: 'map',
      view: this.view,
      controls: this.controls
    })
  }

  viewFactory() {
    return new ol.View({
      // center: ol.extent.getCenter(extent),
      center: [0, 0],
      resolution: 1,
      maxResolution: 4,
      minResolution: 1,
      extent,
      projection: this.projection
    });
  }

  projectionFactory(mpp) {
    let projection = new ol.proj.Projection({
      code: "image",
      metersPerUnit: mpp,
      units: "pixels",
      extent,
    })
    return projection
  }

}

OpenLayer.extent = extent


// module.exports = openLayer;
module.exports = OpenLayer;
