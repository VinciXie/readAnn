// TCGA-18-5592-01Z-00-DX1

// let coordinates = vertexs2featureCoord(vertexs)
// let feature = new ol.Feature(new ol.geom.LineString(coordinates))
// console.log('feature', feature);
// source.addFeature(feature)
const extent = [0, -1000, 1000, 0]

function openLayer({url, mpp}) {
  console.log('url', url);
  var projection = new ol.proj.Projection({
    code: "image",
    metersPerUnit: mpp,
    units: "pixels",
    extent,
    // worldExtent: extent,
  })

  let view = new ol.View({
    center: ol.extent.getCenter(extent),
    zoom: 2,
    maxZoom: 8,
    extent,
    projection
  });

  const map = new ol.Map({
    layers: [
      new ol.layer.Image({
        source: new ol.source.ImageStatic({
          url,
          projection,
          imageExtent: extent
        })
      })
    ],
    target: 'map',
    view,
  })

  return map

}


class OpenLayer {
  constructor({url, mpp}) {
    this.url = url
    this.mpp = mpp
    // console.log('this', this);
    this.projection = this.projectionFactory(mpp);
    this.controls = this.controlsFactory()
    this.view = this.viewFactory()
    this.map = this.mapFactory(url)
  }

  controlsFactory() {
    let mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(1),
      projection: this.projection,
    })
    let controls = ol.control.defaults().extend([mousePositionControl])
    return controls
  }

  mapFactory(url) {
    let imageLayer = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url,
        projection: this.projection,
        imageExtent: extent
      })
    })
    return new ol.Map({
      layers: [ imageLayer ],
      target: 'map',
      view: this.view,
      controls: this.controls
    })
  }

  viewFactory() {
    return new ol.View({
      center: ol.extent.getCenter(extent),
      resolution: 1,
      maxResolution: 16,
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
      worldExtent: extent,
    })
    return projection
  }

}

OpenLayer.extent = extent


module.exports = openLayer;
module.exports = OpenLayer;
