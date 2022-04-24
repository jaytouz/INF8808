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
  initLine, step2LineChart, step3LineChart, step4LineChart, initAnnotation
} from "./linechart";
import {DrawParalleleSet, initializeParalleSet, selectNode} from "./paralleleSetChart"
import {initBarChart, step1BarChart, step2BarChart} from "./barChart";


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

const visContainer3 = d3.select('#viz_bar_chart');
const svg3 = visContainer3.append('svg')
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid');
const g3 = svg3.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

export async function initialize() {
  let pset1 = await initializeParalleSet('./data/pset_env_route_vit.csv', '#153e5e');
  DrawParalleleSet(g2, 1000, 2000, config.margin, pset1);
  let linechartDataAll = await d3.csv('./data/rolling7_viz1_all_vehicule_date.csv');
  let linechartDataType = await d3.csv('./data/rolling7_viz2_acc_by_type_date.csv');
  let barchartData = await d3.csv('./data/stackbar_pourcentage.csv')
  // barchartData = barchartData.map(function (d) { return {key:d.Type, group:d.Gravite, value:+d.count, pourcentage:+d.pourcentage}})

  var colorScaleBar = d3.scaleOrdinal()
      .domain(['LEGER_MATERIEL', 'GRAVE','MORTEL'])
      .range(['#ffb8b8','#ff4646','#9f0000'])

  initBarChart(g3, barchartData, config, colorScaleBar)

  map.buildMap('map');

  // Line Chart
  let dataAll, dataOther, dataCamion
  [dataAll, dataOther, dataCamion] = processData(linechartDataAll, linechartDataType)
  const minY = 0
  let [maxScaleY1, maxScaleY2] = [d3.max(dataAll, d=>d.value), d3.max(dataCamion, d=>d.value)]
  const dates = Array.from(new Set(dataAll.map(d => d.date)))
  let [scaleX, scaleY1, scaleY2] = [getScaleX(dates, config.width),
    getScaleY(minY, maxScaleY1, config.height),
    getScaleY(minY, maxScaleY2, config.height)]

  // Init Line chart
  drawLineChartAxis(g1, scaleX, scaleY1, config.width, config.height)
  const lineAll = initLine(dataAll, scaleX, scaleY1, g1, "#2c4aad")
  const lineOther = initLine(dataOther, scaleX, scaleY1, g1, "#000000")
  const lineCamion = initLine(dataCamion, scaleX, scaleY1, g1, "#8d072b")
  const lineCamionZoom = initLine(dataCamion, scaleX, scaleY2, g1, "#8d072b")

  // Init annotations for line chart
  let [annotation1, annotation2] = initAnnotation(g1, scaleX, scaleY1, scaleY2, config)



  return [
  [
    () => {},
    () => {}
  ],
    [
      () => {step1LineChart(lineAll, annotation1)},
      () => {step2LineChart(lineAll, lineOther, lineCamion, annotation1)},
      () => {step3LineChart(lineAll, lineOther, lineCamion, annotation1, annotation2, lineCamionZoom, scaleY1)},
      () => {step4LineChart(lineOther, lineCamion, scaleY2, lineCamionZoom,annotation2)}
  ],
    [
      () => {step1BarChart(g3, barchartData, config, colorScaleBar)}
      ,
      () => {step2BarChart(g3, barchartData, config, colorScaleBar)}
    ],
    [
      () => {selectNode(g2, -1)},
      () => {selectNode(g2, 2)},
      () => {selectNode(g2, 3)},
      () => {selectNode(g2, -1)}
    ]
  ]
}

