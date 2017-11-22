
// 0 表示在外部
// 1 表示在内部
function isIn(coordinate, features) {
  let n = 0;

  features.map(f => {
    let geo = f.getGeometry();
    if (geo.intersectsCoordinate(coordinate)) {
      // console.log('!!!!');
      return n += 1
    }
  })
  return n
}


exports.getResult = function (features) {
  let p_matrix = [];
  let result = [];
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      let x = 50 * j + 26;
      let y = 50 * i + 26;
      if (result[i] == undefined) {
        result[i] = [];
      }
      p_matrix.push([x, -y])
      result[i][j] = isIn([x, -y], features)
    }
  }
  // console.log('result', result);
  return {result, p_matrix}
}
