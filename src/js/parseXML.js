
function XML2DOC(dir, name) {
  let annPath = dir + name.split('.')[0] + '.xml';
  // console.log('annPath', annPath);
  let imgAnn = fs.readFileSync(annPath, 'utf8');
  let parser = new DOMParser();
  let doc = parser.parseFromString(imgAnn, 'application/xml');
  // console.log('doc', doc);
  // var mpp = doc.querySelector('Annotations').getAttribute('MicronsPerPixel');

  return doc;
}

/**
 * [vertexs2featureCoord description]
 * @param  {[NodeList]} vertexs [NodeList]
 * @return {Array.<ol.Coordinate>}         [Array]
 */
function vertexs2featureCoord(vertexs) {
  let coordinates = [];
  vertexs.forEach(vertex => {
    let x = Number(vertex.getAttribute('X'))
    let y = -vertex.getAttribute('Y');
    if (x < 0 || x > 1000 || y > 0 || y < -1000) {
      console.log('x, y', x, y);
    }
    if (x < 0) {
      x = 0
    }else if (x > 1000) {
      x = 1000
    }
    if (y > 0) {
      y = 0
    } else if (y < -1000) {
      y = -1000
    }
    coordinates.push([x, y])
  })
  return coordinates
}

/**
 * [parseDOC description]
 * @param  {XMLdocument} doc [description]
 * @return {Array.<Array.<ol.Coordinate>>}     [description]
 */
function parseDOC(doc) {
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

const XML_Parser = {
  XML2DOC,
  parseDOC
}

module.exports = XML_Parser;
