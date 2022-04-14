/**
 * Sets up an event handler for when the mouse enters and leaves the squares
 * in the heatmap. When the square is hovered, it enters the "selected" state.
 *
 * The tick labels for the year and neighborhood corresponding to the square appear
 * in bold.
 *
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 * @param {Function} rectSelected The function to call to set the mode to "selected" on the square
 * @param {Function} rectUnselected The function to call to remove "selected" mode from the square
 * @param {Function} selectTicks The function to call to set the mode to "selected" on the ticks
 * @param {Function} unselectTicks The function to call to remove "selected" mode from the ticks
 * @param g
 * @param colorScale
 * @param otherColor
 */
export function setEventHandler (g, colorScale, otherColor) {
  // TODO : Select the squares and set their event handlers
  var nodes = g.selectAll('.graph-node')

  console.log('values : ', nodes)

  nodes.on('click', function (d) {
    onClickEvent(g, d, colorScale, otherColor)
  })
}

/**
 * @param g
 * @param data
 * @param colorScale
 * @param otherColor
 */
export function onClickEvent (g, data, colorScale, otherColor) {
  var keys = []
  console.log('keys', keys)
  console.log('data', data)
  console.log('targetLinks', data.targetLinks)
  AddSourceLinksKeys(keys, data.sourceLinks)
  AddTargetLinksKeys(keys, data.targetLinks)
  console.log('keys', keys)

  g.selectAll('.graph-line')
    .select('path')
    .attr('stroke', d => keys.includes(d.index) ? colorScale(d.value) : otherColor)
}

/**
 * @param keys
 * @param sources
 */
export function AddSourceLinksKeys (keys, sources) {
  console.log('sources', sources)
  sources.forEach(element => {
    if (!keys.includes(element.index)) { keys.push(element.index) }
    AddSourceLinksKeys(keys, element.target.sourceLinks)
  })
}

/**
 * @param keys
 * @param targets
 */
export function AddTargetLinksKeys (keys, targets) {
  console.log('targets', targets)
  targets.forEach(element => {
    if (!keys.includes(element.index)) { keys.push(element.index) }
    AddTargetLinksKeys(keys, element.source.targetLinks)
  })
}
