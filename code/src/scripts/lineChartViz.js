import * as d3Annotation from 'd3-svg-annotation'
import * as scales from './scales'
import * as helper from './helper'
import { annotation } from 'd3-svg-annotation'

/**
 * @param pathToCsv
 * @param g
 * @param xScale
 * @param yScale
 * @param graphSize
 * @param margin
 * @param title
 * @param color
 * @param color1
 * @param color2
 * @param annotations
 */
export function doubleLineChart (pathToCsv, g, xScale, yScale, graphSize, margin, title, color1, color2, annotations = []) {
  helper.appendAxes(g)
  helper.appendGraphLabels(g)
  helper.placeTitle(g)
  let camion = []
  let autre = []
  positionLabels(g, graphSize.width, graphSize.height)

  // BAD POUR LA MEMOIRE...
  d3.csv(pathToCsv).then((data) => {
    data = data.map(function (d) {
      return {
        type: d.Types,
        date: d3.timeParse('%Y-%m-%d')(d.Date),
        nombre: +d.Nombres
      }
    })
    camion = data.filter(d => d.type === 'CAMION')
    autre = data.filter(d => d.type !== 'CAMION')
    xScale = scales.setXScale(graphSize.width, data)
    yScale = scales.setYScale(graphSize.height, data)
    helper.drawXAxis(g, xScale, graphSize.height)
    helper.drawYAxis(g, yScale)
    drawLine(g, camion, color1, xScale, yScale)
    drawLine(g, autre, color2, xScale, yScale)
    if (annotations.length > 0) {
      drawAnnotationsViz(g, xScale, yScale, annotations)
    }
    setTitleText(g, title)
  })
}

/**
 * @param pathToCsv
 * @param g
 * @param xScale
 * @param yScale
 * @param graphSize
 * @param margin
 * @param title
 * @param color
 * @param annotateViz : string be 'viz1' or 'viz3'
 */
export function singleLineChart (pathToCsv, g, xScale, yScale, graphSize, margin, title, color, annotateViz = '') {
  helper.appendAxes(g)
  helper.appendGraphLabels(g)
  helper.placeTitle(g)
  positionLabels(g, graphSize.width, graphSize.height)
  d3.csv(pathToCsv).then((data) => {
    data = data.map(function (d) {
      return {
        date: d3.timeParse('%Y-%m-%d')(d.Date),
        nombre: +d.Nombres
      }
    })
    xScale = scales.setXScale(graphSize.width, data)
    yScale = scales.setYScale(graphSize.height, data)
    helper.drawXAxis(g, xScale, graphSize.height)
    helper.drawYAxis(g, yScale)

    drawLine(g, data, color, xScale, yScale)
    if (annotation !== '') {
      const annotation = getAnnotation(xScale, yScale, margin, graphSize, annotateViz)
      drawAnnotationsViz(g, xScale, yScale, annotation)
    }
    setTitleText(g, title)
  })
}

/**
 * @param xScale
 * @param yScale
 * @param margin
 * @param graphSize
 * @param viz : string can be 'viz1' or 'viz3'
 */
function getAnnotation (xScale, yScale, margin, graphSize, viz) {
  let annotation = []
  switch (viz) {
    case 'viz1':
      annotation = [{
        note: { label: 'Vision Zéro' },
        subject: {
          y1: margin.top,
          y2: graphSize.height - margin.bottom
        },
        y: margin.top,
        data: { x: '2016-01-01' } // position the x based on an x scale
      },
      {
        note: { label: 'Début couvre-feu' },
        subject: {
          y1: margin.top,
          y2: graphSize.height - margin.bottom
        },
        y: margin.top,
        data: { x: '2020-03-14' }
      }]
      break
    case 'viz3':
      annotation = [
        {
          note: {
            title: 'Tendance à la hausse'
          },
          connector: {
            end: 'arrow' // Can be none, or arrow or dot
          },
          subject: {
            height: graphSize.height - margin.top - margin.bottom,
            width: xScale(new Date('2020-03-14')) - xScale(new Date('2016-01-01'))
          },
          type: d3Annotation.annotationCalloutRect,
          x: xScale(new Date('01-01-2016')),
          y: margin.top,
          disable: ['connector'] // doesn't draw the connector

        }]
      break
  }
  return annotation
}

/**
 * Positions the x axis label and y axis label.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */
export function positionLabels (g, width, height) {
  // TODO : Position axis labels
  var labelDate = g.selectAll('.x.axis-text')
  var labelAccident = g.selectAll('.y.axis-text')

  labelDate.attr('x', width / 2)
  labelDate.attr('y', height + 40)

  labelAccident.attr('x', -40)
  labelAccident.attr('y', height / 2)
}

/**
 * Draws the circles on the graph.
 *
 * @param g
 * @param {object} data The data to bind to
 * @param {*} rScale The scale for the circles' radius
 * @param {*} colorScale The scale for the circles' color
 * @param color
 * @param xScale
 * @param yScale
 */
export function drawLine (g, data, color, xScale, yScale) {
  g.append('path')
    .datum(data)
    .attr('class', 'linePath')
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1.5)
    .attr('d', d3.line()
      .x(function (d) { return xScale(d.date) })
      .y(function (d) { return yScale(d.nombre) })
    )
}

/**
 * Draw vertical line to indicate an event in time
 *
 * @param date
 * @param text
 * @param g
 * @param xScale
 * @param yScale
 * @param margin
 * @param height
 * @param annotations
 */
export function drawAnnotationsViz (g, xScale, yScale, annotations) {
  /* Code below relevant for annotations */
  const type = d3Annotation.annotationCustomType(
    d3Annotation.annotationXYThreshold,
    {
      note: {
        lineType: 'none',
        orientation: 'top',
        align: 'middle'
      }
    }
  )
  const makeAnnotations = d3Annotation.annotation()
    .type(type)
    // Gives you access to any data objects in the annotations array
    .accessors({
      x: function (d) { return xScale(new Date(d.x)) },
      y: function (d) { return yScale(d.y) }
    })
    .annotations(annotations)
    .textWrap(30)

  g.append('g')
    .attr('class', 'annotation-group')
    .call(makeAnnotations)
}

/**
 * Update the title of the graph.
 *
 * @param {number} year The currently displayed year
 * @param g
 * @param title
 */
export function setTitleText (g, title) {
  // TODO : Set the title
  g.select('.title')
    .text(title)
}

// /**
//  * @param g
//  * @param data
//  * @param color
//  * @param xScale
//  * @param yScale
//  * @param margin
//  * @param height
//  */
// function build (g, data, color, xScale, yScale, margin, height) {
//   console.log('building lineCharts')
//   drawLine(g, data, color, xScale, yScale)
//   drawAnnotationsViz1(g, xScale, yScale, margin, height)
//   setTitleText()
// }
