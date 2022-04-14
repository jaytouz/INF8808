'use strict'

import * as helper from './helper.js'
import * as line from './lineChartViz.js'
import d3Tip from 'd3-tip'
import * as event from './event.js'
import * as d3Chromatic from 'd3-scale-chromatic'
import * as tooltip from './tooltips'
import * as pset from './paralleleSetChart'
import { sankey as Sankey } from 'd3-sankey'

/**
 * @file This file is the entry-point for the code.
 * @author Jérémie Tousignant
 * @version v1.0.0
 */
(function (d3) {
  const margin = {
    top: 75,
    right: 200,
    bottom: 100,
    left: 80
  }

  let svgSize, graphSize

  setSizing('#map-hexa')
  setSizing('#line-chart1')
  setSizing('#line-chart2')
  setSizing('#line-chart3')
  setSizing('#bar-chart')
  setSizing('#pset1')
  setSizing('#pset2')
  setSizing('#pset3')

  const g0 = helper.generateG(margin, '#viz0', 'graph-g0')
  const g1 = helper.generateG(margin, '#viz1', 'graph-g1')
  const g2 = helper.generateG(margin, '#viz2', 'graph-g2')
  const g3 = helper.generateG(margin, '#viz3', 'graph-g3')
  const g4 = helper.generateG(margin, '#viz4', 'graph-g4')
  const g5 = helper.generateG(margin, '#viz5', 'graph-g5')
  const g6 = helper.generateG(margin, '#viz6', 'graph-g6')
  const g7 = helper.generateG(margin, '#viz7', 'graph-g7')

  let xScale0, yScale0
  let xScale1, yScale1
  let xScale2, yScale2
  let xScale3, yScale3
  let xScale4, yScale4
  let xScale5, yScale5
  let xScale6, yScale6
  let xScale7, yScale7

  line.singleLineChart('./rolling7_viz1_all_vehicule_date.csv',
    g1,
    xScale1,
    yScale1,
    graphSize,
    margin,
    'Accidents de tous les véhicules à Montréal par jour (Moyenne roulante sur 7 jours)',
    'blue',
    'viz1')

  line.doubleLineChart(
    './rolling7_viz2_acc_by_type_date.csv',
    g2,
    xScale2,
    yScale2,
    graphSize,
    margin,
    'Accidents des véhicules impliquant des camions ou les autres types de véhicules à Montréal par jour (Moyenne roulante sur 7 jours)',
    'red',
    'black'
  )
  line.singleLineChart('./rolling7_viz3_acc_camion_date.csv',
    g3,
    xScale3,
    yScale3,
    graphSize,
    margin,
    'Accidents impliquant des camions à Montréal par jour (Moyenne roulante sur 7 jours)',
    'red',
    'viz3')

  /**
   * This function handles the graph's sizing.
   *
   * @param svgId
   * @param margin
   */
  function setSizing (svgId) {
    svgSize = {
      width: 1000,
      height: 600
    }

    graphSize = {
      width: svgSize.width - margin.right - margin.left,
      height: svgSize.height - margin.bottom - margin.top
    }

    helper.setCanvasSize(svgId, svgSize.width, svgSize.height)
  }

  const otherColor = '#CCC'
  const colorScale = d3.scaleSequential(d3Chromatic.interpolateYlGnBu)

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { return tooltip.getContents(d) })
  d3.select('#pset1 ').call(tip)

  d3.csv('./pset_env_route_vit.csv').then(function (data) {
    console.log('data : ', data)

    data = data.filter(d => d.Gravite === 'Grave ou Mortel')

    console.log('data : ', data)
    var keys = Object.keys(data[0])
    keys.pop()
    console.log(keys)
    const graph = pset.CreateGraphNodeAndLink(keys, data)
    console.log('graph : ', graph)

    pset.setColorScaleDomain(colorScale, graph.links)

    setSizing()
    build()

    /* var first = d3.select("#graph-g")
      .selectAll(".graph-node")
      .filter(d => d.name == "Grave ou Mortel")
      .data()

    console.log("first : ", first) */

    // event.onClickEvent(first[0], links, gravityKeys, lineColorScale, updateLineColorScale)
    /**
     *   This function builds the graph.
     */

    /**
     *
     */
    function build () {
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

      pset.CreateSVGNodes(g5, data, nodes, tip, graphSize.height)
      pset.CreateSVGLines(g5, links, otherColor)

      pset.CreateSVGTextInfo(g5, graphSize.width)
      event.setEventHandler(g5, colorScale, otherColor)
    }

    window.addEventListener('resize', () => {
      build()
    })
  })
})(d3)
