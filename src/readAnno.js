
function vertexs2featureCoord(vertexs) {
  let coord = [];
  vertexs.forEach(vertex => {
    let x = vertex.getAttribute('X');
    let y = vertex.getAttribute('Y');
    y = 1000 - y
    coord.push([x, y])
  })
  return coord
}

function coord2feature(coord) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([coord]),
    name: 'My Polygon'
  });
  return feature
}

function parseAnno(doc) {
  let regions = doc.querySelectorAll('Region');
  // console.log('regions', regions);
  let features = [];
  for (var i = 0; i < regions.length; i++) {
    let region = regions[i]
    // let id = region.getAttribute('Id')
    let vertexs = region.querySelectorAll('Vertex');
    let coord = vertexs2featureCoord(vertexs);
    let fea = coord2feature(coord);
    features.push(fea)
  }
  return features
};

exports.feaFactory = function (doc) {
  let features = parseAnno(doc)
  // console.log('features', features);
  return features
};

// module.exports = name;
