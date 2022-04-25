import * as d3 from 'd3';
import { annotation } from 'd3-svg-annotation'
import * as d3Annotation from 'd3-svg-annotation'


function drawXAxis(svg, x, height){
    svg.append('g')
        .attr('id', 'xAxisLineChart')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
}

function addXlabel(width, margin){
    d3.select('#xAxisLineChart')
        .append("text")
        .attr("x", width/1.7)
        .attr("y", margin.bottom/1.5)
        .attr('font-size', '1.5em')
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("Date du rapport de l'accident")
}

export function getScaleX(dates, width){
    return d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, width])
}

function drawYAxis(svg, y){
    svg.append("g")
        .attr('id', 'yAxisLineChart')
        .call(d3.axisLeft().scale(y))
}

function addYlabel(margin){
    d3.select('#yAxisLineChart')
        .append("text")
        .attr("x", - margin.left * 4.5 )
        .attr("y", - margin.left/2)
        .attr('font-size', '1.5em')
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Nombre d'accidents par jour (moyenne roulante 7 jours)")
}

export function getScaleY(min, max, height){
    return  d3.scaleLinear()
        .domain([min, max])
        .range([ height, 0 ])
}

export function transitionYAxis(y, delay=2000, id='yAxisLineChart'){
    d3.select('#' + id)
        .transition()
        .delay(delay)
        .call(d3.axisLeft(y))
}

export function processData(data1, data2){
    data1 = data1.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), value:+d.Nombres}})

    data2 = data2.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), type: d.Types, value:+d.Nombres}})
    const other = data2.filter(function(d) { return d.type === 'SANS_CAMION'})
    const camion = data2.filter(function(d) {return d.type === 'CAMION'})

    // data3 = data3.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), value:+d.Nombres}})
    return [data1, other, camion]
}

export function drawLineChartAxis(g, x, y, width, height, margin){
    drawXAxis(g,x, height)
    drawYAxis(g, y)
    addYlabel(margin)
    addXlabel(width, margin)
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
 * @param xScale
 * @param yScale
 * @param margin
 * @param graphSize
 * @param viz : string can be 'annotation1' or 'annotation2'
 */
function getAnnotation (xScale, yScale, margin, graphSize, viz) {
    let annotation = []
    switch (viz) {
        case 'annotation1':
            annotation = [{
                note: { label: 'Vision Zéro' },
                subject: {
                    y1: margin.top,
                    y2: yScale(0)
                },
                y: margin.top,
                data: {x:'2016-09-01'} // position the x based on an x scale
            },
                {
                    note: { label: 'Début couvre-feu' },
                    subject: {
                        y1: margin.top,
                        y2: yScale(0)
                    },
                    y: margin.top,
                    data: {x:'2020-03-14'}
                }]
            break
        case 'annotation2':
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
                    x: xScale(new Date('2016-01-01')),
                    y: margin.top,
                    disable: ['connector'] // doesn't draw the connector

                }]
            break
    }
    return annotation
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

    const annotation = g.append('g')
        .attr('class', 'annotation-group')
        .call(makeAnnotations)

    return annotation
}

export function initAnnotation(g, xScale, yScale1, yScale2, config){

    const annotation1 = getAnnotation(xScale, yScale1, config.margin, config, 'annotation1')
    const annotation2 = getAnnotation(xScale, yScale2, config.margin, config, 'annotation2')
    const a1 = drawAnnotationsViz(g, xScale, yScale1, annotation1)
    const a2 = drawAnnotationsViz(g, xScale, yScale2, annotation2)
    a1.style('opacity', 0)
    a2.style('opacity', 0)
    return [a1, a2]
}

export function initLine(data, x, y, svg, color) {
    // Updata the line
    const line = svg.append('g')
        .selectAll(".lines")
        .data([data])
        .join("path")
        .attr("class", "lines")
        .attr("d",d3.line()
                .x(function (d) { return x(d.date)})
                .y(function (d) { return y(d.value)})
        )
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .style("opacity", 0)

    return line
}

/**
 * draw axis, init chart with transition
 */
export function step1LineChart(line1, annotation1){
    console.log('drawing all vehicule')
    line1
        .transition()
        .style('opacity', 0)

    annotation1.style('opacity', 0 )


    // show graphe opacity 1
    // exit data type
    // annotation 1 opacity 0
}



export function step2LineChart(line1, line2, line3, annotation1){
    line2.transition().style('opacity', 0)
    line3.transition().style('opacity', 0)

    line1
        .transition()
        .delay(200)
        .style('opacity',1)

    annotation1.style('opacity', 1)
    //add annotation

}


export function step3LineChart(line1, line2, line3, annotation1, annotation2, line4, y){
    transitionYAxis(y, 0)
    line4.transition().style('opacity',0)
    annotation2.transition().style('opacity', 0)

    line1.transition().delay(500).style('opacity', 0)
    annotation1.style('opacity', 0)

    line2.transition().delay(1000).style('opacity', 1)
    line3.transition().delay(1000).style('opacity', 1)
}


export function step4LineChart(line2, line3, y, line4, annotation2){
    line2.transition().delay(1000).style('opacity', 0)
    line3.transition().delay(1000).style('opacity', 0)

    transitionYAxis(y, 2000)


    line4.transition().delay(3000).style('opacity',1)
    annotation2.transition().delay(3000).style('opacity', 1)

}
