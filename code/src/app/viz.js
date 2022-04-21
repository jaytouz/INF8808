/**
 * viz.js
 * =======
 * File used to define the visualization section.
 */

import * as d3 from 'd3';

const config = {
  width: 500,
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

const visContainer1 = d3.select('#viz');
const svg1 = visContainer1.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');
const g1 = svg1.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

const visContainer2 = d3.select('#viz2');
const svg2 = visContainer2.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');
const g2 = svg2.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

export async function initialize() {
  const data = await d3.csv('./data/data.csv');
  const rect1 = g1.append('rect')
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', 'green');

  const rect2 = g2.append('rect')
    .attr('width', config.width)
    .attr('height', config.height)
    .style('fill', 'green');


  return [[
    () => {rect1.transition().duration(300).style('fill','green')},
    () => {rect1.transition().duration(300).style('fill','red')},
    () => {rect1.transition().duration(300).style('fill','blue')},
    () => {rect1.transition().duration(300).style('fill','yellow')}
  ],[
      () => {rect2.transition().duration(300).style('fill','green')},
      () => {rect2.transition().duration(300).style('fill','red')},
      () => {rect2.transition().duration(300).style('fill','blue')},
      () => {rect2.transition().duration(300).style('fill','yellow')}
    ]
  ]
}
