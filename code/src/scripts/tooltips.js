import { style } from 'd3'

/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  return "<span id='tooltip-title'>" + d.name + '</span>'
}
