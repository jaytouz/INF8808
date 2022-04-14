import * as d3 from 'd3'
import { sankeyLinkHorizontal } from 'd3-sankey'

/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 */
export function setColorScaleDomain (colorScale, data) {
  // TODO : Set domain of color scale
  colorScale.domain([0, d3.max(data, d => d.value)])
}

/**
 * @param keys
 * @param data
 */
export function CreateGraphNodeAndLink (keys, data) {
  let index = -1
  const nodes = []
  const nodeByKey = new Map()
  const indexByKey = new Map()
  const links = []

  for (const k of keys) {
    for (const d of data) {
      const key = JSON.stringify([k, d[k]])
      if (nodeByKey.has(key)) continue
      const node = { name: d[k] }
      nodes.push(node)
      nodeByKey.set(key, node)
      indexByKey.set(key, ++index)
    }
  }

  for (let i = 1; i < keys.length; ++i) {
    const a = keys[i - 1]
    const b = keys[i]
    const prefix = keys.slice(0, i + 1)
    const linkByKey = new Map()
    for (const d of data) {
      const names = prefix.map(k => d[k])
      const key = JSON.stringify(names)
      const value = parseInt(d.count) || 1
      let link = linkByKey.get(key)
      if (link) { link.value += value; continue }
      link = {
        source: indexByKey.get(JSON.stringify([a, d[a]])),
        target: indexByKey.get(JSON.stringify([b, d[b]])),
        names,
        value
      }
      links.push(link)
      linkByKey.set(key, link)
    }
  }

  return { nodes, links }
}

/**
 * @param g
 * @param data
 * @param nodes
 * @param tip
 * @param height
 */
export function CreateSVGNodes (g, data, nodes, tip, height) {
  const count = d3.sum(data, d => d.count)
  var y = height
  console.log('count : ', count)
  console.log('height : ', height)
  g.selectAll('.graph-node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'graph-node')
    .append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('height', d => d.y1 - d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('fill', 'black')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}

/**
 * @param g
 * @param links
 * @param color
 */
export function CreateSVGLines (g, links, color) {
  g.selectAll('.graph-line')
    .data(links)
    .enter()
    .append('g')
    .attr('fill', 'none')
    .attr('class', 'graph-line')
    .append('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', d => color)
    .attr('stroke-width', d => d.width)
    .style('mix-blend-mode', 'multiply')
}

/**
 * @param g
 * @param width
 */
export function CreateSVGTextInfo (g, width) {
  g.selectAll('.info')
    .remove()

  g.selectAll('.graph-node')
    .style('font', '10px sans-serif')
    .append('text')
    .attr('class', 'info')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .text(d => d.name)
    .append('tspan')
    .attr('class', 'info')
    .attr('fill-opacity', 0.7)
    .text(d => ` ${d.value.toLocaleString()}`)
}
