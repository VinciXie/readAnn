
function vertexs2featureCoord(vertexs) {
  let coord = [];
  vertexs.forEach(vertex => {
    let x = Number(vertex.getAttribute('X'))
    let y = -vertex.getAttribute('Y');
    coord.push([x, y])
  })
  return coord
}

function coord2feature(coord) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([coord]),
  });
  return feature
}

// 这个函数返回的是一个深度 1 的坐标的数组
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
};

exports.feaFactory = function (doc) {
  let annoArr = parseAnno(doc)
  // let annoArr = [[[100, -100], [500, -150], [700, -600], [200, -700]]]
  // console.log('annoArr', annoArr);
  let features = annoArr.map(coord2feature)
  // console.log('features', features);
  return features
};

// module.exports = name;
