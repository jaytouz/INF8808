
/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @param id
 * @param divName
 * @param divId
 * @param gId
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin, divId, gId) {
  return d3.select(divId)
    .select('svg')
    .append('g')
    .attr('id', gId)
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param svgId
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (svgId, width, height) {
  d3.select(svgId)
    .attr('width', width)
    .attr('height', height)
}

/**
 * Appends an SVG g element which will contain the axes.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')

  g.append('g')
    .attr('class', 'y axis')
}
/**
 * Appends the labels for the the y axis and the title of the graph.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendGraphLabels (g) {
  g.append('text')
    .text("Nombre d'accidents à Montréal")
    .attr('class', 'y axis-text')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', 12)

  g.append('text')
    .text('Date')
    .attr('class', 'x axis-text')
    .attr('font-size', 12)
}

/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param g
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graphic
 */
export function drawXAxis (g, xScale, height) {
  g.select('.x.axis')
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
}

/**
 * Draws the Y axis to the left of the diagram.
 *
 * @param g
 * @param {*} yScale The scale to use to draw the axis
 */
export function drawYAxis (g, yScale) {
  g.select('.y.axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
}

/**
 * Places the graph's title.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function placeTitle (g) {
  g.append('text')
    .attr('class', 'title')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 14)
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} year The year to display
 * @param vizName
 * @param id
 * @param {number} width The width of the graph, used to place the button
 */
export function drawButton (g, width) {
  const button = g.append('g')
    .attr('class', 'button')
    .attr('transform', 'translate(' + width + ', 140)')
    .attr('width', 130)
    .attr('height', 25)

  button.append('rect')
    .attr('width', 130)
    .attr('height', 30)
    .attr('fill', '#f4f6f4')
    .on('mouseenter', function () {
      d3.select(this).attr('stroke', '#362023')
    })
    .on('mouseleave', function () {
      d3.select(this).attr('stroke', '#f4f6f4')
    })

  button.append('text')
    .attr('x', 65)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'button-text')
    .text('See next viz')
    .attr('font-size', '10px')
    .attr('fill', '#362023')
}
