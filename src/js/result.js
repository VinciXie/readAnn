const {getTime} = require('../lib/time');


const r = 5;
const sliding = 8;
const patch = 41;
const ks = 20;

const classes = []

function point2extent(coordinate, ks) {
  let [x, y] = coordinate;
  let extent = [x - ks/2, y - ks/2, x + ks/2, y + ks/2];
  return extent
}

let sqrt_r = Math.sqrt(r)
// console.log('sqrt_r', sqrt_r);
function intersectsCoordinates(geo, coordinate) {
  let arr = [];
  let [x, y] = coordinate;
  arr.push([x - r, y])
  arr.push([x - sqrt_r, y + sqrt_r])
  arr.push([x - sqrt_r, y - sqrt_r])
  arr.push([x, y + r])
  arr.push([x, y - r])
  arr.push([x + sqrt_r, y + sqrt_r])
  arr.push([x + sqrt_r, y - sqrt_r])
  arr.push([x + r, y]);
  let n = 0;
  for (let coor of arr) {
    if (geo.intersectsCoordinate(coor)) {
      n += 1
    }
  }
  if (n == 0) {
    return 2
  } else if (n == arr.length) {
    return 4
  } else {
    return 3
  }
}


let result_size = Math.ceil( (1000 - patch) / sliding ) + 1;
console.log('result_size', result_size);

function inLevel(coordinate, source) {
  let extent = point2extent(coordinate, patch - 1);
  let extent_small = point2extent(coordinate, ks);
  let features = []
  let n = 0;
  // 里面的函数如果没有执行，那就是 0
  // 只要执行了，就是 1
  source.forEachFeatureIntersectingExtent(extent, f => {
    if (n < 1) { n = 1 }
    features.push(f);
    let geo = f.getGeometry();
    if (geo.intersectsExtent(extent_small)) {
      n = intersectsCoordinates(geo, coordinate)
      if (n == 4) {
        return n;
      }
    }
  })
  return n;
}

exports.getResult = function ( { polygonSource } ) {
  let t1 = getTime()
  let features = polygonSource.getFeatures()
  let p_matrix = [];
  let result = [];
  let result_pre = [0,0,0,0,0]
  // p_matrix.push([0, 0])
  // p_matrix.push([50, -50])
  for (var i = 0; i < result_size; i++) {
    for (var j = 0; j < result_size; j++) {
      let x = sliding * j + (patch - 1)/2;
      let y = sliding * i + (patch - 1)/2;
      if (result[i] == undefined) {
        result[i] = [];
      }
      p_matrix.push([x, -y])
      result[i][j] = inLevel([x, -y], polygonSource)
      result_pre[result[i][j]] += 1
      // break
    }
    // break
  }
  console.log('result_pre', result_pre);
  // console.log('time', (getTime() - t1) / 1000 + 's' );
  return {result_pre, result, p_matrix}
}
