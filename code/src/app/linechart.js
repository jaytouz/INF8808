import * as d3 from 'd3';


function drawXAxis(svg, x, height){
    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
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

export function processData(data1, data2, data3){
    data1 = data1.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), value:+d.Nombres}})
    data2 = data2.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), key: d.Types, value:+d.Nombres}})
    data3 = data3.map(function(d) { return {date:d3.timeParse("%Y-%m-%d")(d.Date), value:+d.Nombres}})
    return [data1, data2, data3]
}

export function drawLineChartAxis(g, x, y, width, height){
    drawXAxis(g,x, height)
    drawYAxis(g, y)
}

export function drawOneLine(data, x, y, svg, color) {
    // Updata the line
    const line = svg.append('g')
        .selectAll(".lines")
        .data([data])
        .join("path")
        .attr("class", "lines")
        .transition()
        .duration(3000)
        .attr("d",d3.line()
                .x(function (d) { return x(d.date)})
                .y(function (d) { return y(d.value)})
        )
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)

    return line
}

function hideLine(svg){
    d3.selectAll('.lines')
        .transition('')
        .style('opacity', 0)
}

/**
 * draw axis, init chart with transition
 */
export function step1LineChart(data, x, y, g, color){
    console.log('drawing all vehicule')
    drawOneLine(data, x, y , g, color)
    // show graphe opacity 1
    // exit data type
    // annotation 1 opacity 0
}



export function step2LineChart(data, x, y, g, color){
    console.log('drawing all vehicule')
    drawOneLine(data, x, y , g, color)

}


export function step3LineChart(){

}


export function step4LineChart(){

}
