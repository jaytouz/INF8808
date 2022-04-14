
/**
 *
 */
export function barChart () {

}

/**
 * @param g
 * @param width
 * @param height
 */
function positionLabels (g, width, height) {
  // TODO : Position axis labels
  var labelDate = g.selectAll('.x.axis-text')
  var labelAccident = g.selectAll('.y.axis-text')

  labelDate.attr('x', width / 2)
  labelDate.attr('y', height + 40)

  labelAccident.attr('x', -40)
  labelAccident.attr('y', height / 2)
}
