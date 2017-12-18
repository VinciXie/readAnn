readAnn

### 使用记录
一个图上的所有坐标可以通过一个 feature 的 ol.geom.Polygon 表示出来，但是这样的话，就使用 intersectsCoordinate 这个 api 只返回 false

所以还是采用多个 feature 来表示
