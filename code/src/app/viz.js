/**
 * viz.js
 * =======
 * File used to define the visualization section.
 */

import * as d3 from 'd3';
import * as map from "./map.js";
import {
  getScaleX,
  getScaleY,
  drawLineChartAxis,
  processData,
  step1LineChart,
  drawOneLine,
  transitionYAxis
} from "./linechart";
import {DrawParalleleSet, initializeParalleSet, selectNode} from "./paralleleSetChart"


const config = {
  width: 1000,
  height: 500,
  margin: {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  }
}
const fullWidth = config.margin.left + config.width + config.margin.right;
const fullHeight = config.margin.top + config.height + config.margin.bottom;

const visContainer1 = d3.select('#viz_line_chart');
const svg1 = visContainer1.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');
const g1 = svg1.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

const visContainer2 = d3.select('#viz2');
const svg2 = visContainer2.append('svg')
  .attr('viewBox', `0 0 ${2400} ${1400}`)
  .attr('preserveAspectRatio', 'xMidYMid');
const g2 = svg2.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

export async function initialize() {
  let linechartAll = await d3.csv('./data/rolling7_viz1_all_vehicule_date.csv');
  let linechartTypes = await d3.csv('./data/rolling7_viz2_acc_by_type_date.csv');
  let linechartCamion = await d3.csv('./data/rolling7_viz3_acc_camion_date.csv');
  let pset1 = await initializeParalleSet('./data/pset_env_route_vit.csv', '#153e5e');
  DrawParalleleSet(g2, 1000, 2000, config.margin, pset1);


  [linechartAll, linechartTypes, linechartCamion] = processData(linechartAll, linechartTypes, linechartCamion)
  const minY = 0
  let [maxScaleY1, maxScaleY2] = [d3.max(linechartAll, d=>d.value), d3.max(linechartCamion, d=>d.value)]
  const dates = Array.from(new Set(linechartAll.map(d => d.date)))

  let [scaleX, scaleY1, scaleY2] = [getScaleX(dates, config.width),
    getScaleY(minY, maxScaleY1, config.height),
    getScaleY(minY, maxScaleY2, config.height)]
  drawLineChartAxis(g1, scaleX, scaleY1, config.width, config.height)
  // drawLineChartAxis(g1, scaleX, scaleY1, config.width, config.height)
  // drawOneLine(linechartAll, scaleX, scaleY1, g1, "#2c4aad")
  // transitionYAxis(scaleY2)
  // drawOneLine(linechartCamion, scaleX, scaleY2, g1, "#ce0d0d")

  // map.buildMap('map');

  return [
  [
    () => {},
    () => {},
    () => {},
    () => {}
  ],
    [
      () => {},
      () => {drawOneLine(linechartAll, scaleX, scaleY1, g1, "#2c4aad")},
      () => {transitionYAxis(scaleY2)},
      () => {drawOneLine(linechartCamion, scaleX, scaleY2, g1, "#ce0d0d")}
  ],
    [
      () => {selectNode(g2, -1)},
      () => {selectNode(g2, 2)},
      () => {selectNode(g2, 3)},
      () => {selectNode(g2, -1)}
    ]
  ]
}
