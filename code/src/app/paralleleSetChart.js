import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import { sankey as Sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

const otherColor = '#CCC'
const selectionColor = '#940d45'

export async function initializeParalleSet(dataPath) {
  console.log("initialize");
  return await d3.csv(dataPath).then(function (data){

    data = data.filter(d => d.Gravite === 'Grave ou Mortel')

    return data
  })
}

export async function DrawParalleleSet(g, height, width, margin, data) {
  console.log("draw");

  const graphSize = {
    width: width - margin.right - margin.left,
    height: height - margin.bottom - margin.top
  }

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { return getContents(d) })
  g.call(tip)

  var keys = Object.keys(data[0])
  keys.pop()
  const graph = CreateGraphNodeAndLink(keys, data)

  const sankey = Sankey()
      .nodeSort(null)
      .linkSort(null)
      .nodeWidth(4)
      .nodePadding(20)
      .extent([[0, 5], [graphSize.width, graphSize.height]])

    const { nodes, links } = sankey({
      nodes: graph.nodes.map(d => Object.assign({}, d)),
      links: graph.links.map(d => Object.assign({}, d))
    })

    CreateSVGNodes(g, data, nodes, tip, graphSize.height)
    CreateSVGLines(g, links, otherColor, tip)

    CreateSVGTextInfo(g, graphSize.width)

    setEventHandler(g, selectionColor, otherColor)

  return g
}

export function selectNode(g, index) {
  var nodes = g.selectAll('.graph-node').data()
  //console.log("nodes : ", nodes);
  onClickEvent(g, nodes[index], selectionColor, otherColor)
}

/**
 * @param keys
 * @param data
 */
function CreateGraphNodeAndLink (keys, data) {
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
function CreateSVGNodes (g, data, nodes, tip, height) {
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
function CreateSVGLines (g, links, color, tip) {
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
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}

/**
 * @param g
 * @param width
 */
function CreateSVGTextInfo (g, width) {
  g.selectAll('.info')
    .remove()

  g.selectAll('.graph-node')
    .style('font', '20px sans-serif bolder')
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
}

/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
function getContents (d) {
  var data = d3.select(d.target).data()
  return "<span id='tooltip-title'>" + data[0].value + '</span>'
}

/**
 * Sets up an event handler
 *
 * @param g
 * @param colorScale
 * @param otherColor
 */
function setEventHandler (g, selectionColor, otherColor) {
  // TODO : Select the squares and set their event handlers
  var nodes = g.selectAll('.graph-node')

  console.log('values : ', nodes)

  nodes.on('click', function (d) {
    var data = d3.select(d.target).data();
    onClickEvent(g, data[0], selectionColor, otherColor)
  })
}

/**
 * @param g
 * @param data
 * @param colorScale
 * @param otherColor
 */
function onClickEvent (g, data, selectionColor, otherColor) {
  var keys = []

  AddSourceLinksKeys(keys, data.sourceLinks)
  AddTargetLinksKeys(keys, data.targetLinks)


  g.selectAll('.graph-line')
    .select('path')
    .attr('stroke', d => keys.includes(d.index) ? selectionColor : otherColor)
}

/**
 * @param keys
 * @param sources
 */
function AddSourceLinksKeys (keys, sources) {
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
function AddTargetLinksKeys (keys, targets) {
  console.log('targets', targets)
  targets.forEach(element => {
    if (!keys.includes(element.index)) { keys.push(element.index) }
    AddTargetLinksKeys(keys, element.source.targetLinks)
  })
}