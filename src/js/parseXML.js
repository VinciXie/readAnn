
function XML2DOC(dir, name) {
  let annPath = dir + name.split('.')[0] + '.xml';
  // console.log('annPath', annPath);
  let imgAnn = fs.readFileSync(annPath, 'utf8');
  let parser = new DOMParser();
  let doc = parser.parseFromString(imgAnn, 'application/xml');
  // console.log('doc', doc);
  return doc
}

function vertexs2featureCoord(vertexs) {
  let coord = [];
  vertexs.forEach(vertex => {
    let x = Number(vertex.getAttribute('X'))
    let y = -vertex.getAttribute('Y');
    coord.push([x, y])
  })
  return coord
}

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
