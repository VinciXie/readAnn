
// 0 表示在外部
// 1 表示在内部
function isIn(coordinate, features) {
  let n = 0;
  let [x, y] = coordinate
  let extent = [x - 20, y - 20, x + 20, y + 20];
  for (let f of features) {
    let geo = f.getGeometry();
    if ( geo.intersectsExtent(extent) ) {
      // 中间 40 * 40 的范围内有细胞
      // console.log('中间 40 * 40 的范围内有细胞', coordinate);
      n = -1
    }
    if (geo.intersectsCoordinate(coordinate)) {
      // console.log('点在内部!!!!', coordinate);
      // 点在内部
      return n = 1
    }

  }

  return n
}

let sliding = 8;
let patch = 51;
let result_size = Math.ceil( (1000 - patch) / sliding ) + 1;
console.log('result_size', result_size);

exports.getResult = function (features) {
  let p_matrix = [];
  let result = [];
  // p_matrix.push([0, 0])
  // p_matrix.push([50, -50])
  for (var i = 0; i < result_size; i++) {
    for (var j = 0; j < result_size; j++) {
      let x = sliding * j + 25;
      let y = sliding * i + 25;
      if (result[i] == undefined) {
        result[i] = [];
      }
      p_matrix.push([x, -y])
      result[i][j] = isIn([x, -y], features)
    }
    // break
  }
  // console.log('result', result);
  return {result, p_matrix}
}
