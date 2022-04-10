/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {
  // TODO : Generate the legend in the div with class "legend". Each SVG rectangle
  // should have a width and height set to 15.
  // Tip : Append one div per legend element using class "legend-element".
  d3.select('div.legend')
    .selectAll()
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'legend-element')
    .append('svg')
    .attr('width', 30)
    .attr('height', 15)

  d3.select('div.legend')
    .selectAll('svg')
    .append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', d => color(d))

  d3.select('div.legend')
    .selectAll('.legend-element')
    .append('text')
    .text(d => d)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'left')
}
