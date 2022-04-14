/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {number} width The width of the graph
 * @param {object} data The data to be used
 * @returns {*} The linear scale in X
 */
export function setXScale (width, data) {
  // TODO : Set scale
  // const dates = []
  // data.map(d => dates.push(d.date))
  var xScale = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.date }))
    .range([0, width])

  return xScale
}

/**
 * Defines the log scale used to position the center of the circles in Y.
 *
 * @param {number} height The height of the graph
 * @param {object} data The data to be used
 * @returns {*} The linear scale in Y
 */
export function setYScale (height, data) {
  // TODO : Set scale
  var max = d3.max(data, d => d.nombre)
  var yScale = d3.scaleLinear()
    .domain([0, max])
    .range([height, 0])
  return yScale
}
