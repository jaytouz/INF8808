import * as d3 from 'd3';


// template based on : https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html

/**
 * create and return x axis.
 * @param g
 * @param height
 * @returns {*}
 */
function appendXAxis(g,height){
    g.append("g")
        .attr('id', 'xAxisBar')
        .attr("transform", "translate(0," + height + ")")
}

/**
 * Create and return y axis
 * @param g
 * @returns {*}
 */
function appendYAxis(g){
    g.append("g")
        .attr('id', 'yAxisBar')
}

function drawXAxis(width, height){
    const x = d3.scaleBand()
        .domain(['Camion', 'Sans camion'])
        .range([0, width])
        .padding([0.2])
    d3.select('#xAxisBar').call(d3.axisBottom(x).tickSize(0))
}

function updateYAxis(min, max, height){
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([ height, 0 ])

    // d3.select('#yAxisBar')
    //     .transition()
    //     .call(d3.axisLeft(y).tickValues([]))
}

export function initBarChart(g, data, config, colorScale){
    appendXAxis(g, config.height)
    appendYAxis(g)
    drawXAxis(config.width)
    g.append('g').attr('id', 'rect1')
    g.append('g').attr('id', 'rect2')
    initBarAll(g, data, config, colorScale)
    initBarGraveMortel(g, data, config, colorScale)

}


function initBarAll(g, data, config, colorScale){
    const subgroups = data.columns.slice(1)

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ 0, -config.height]);


    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    d3.select('#rect1')
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("transform", "translate(0," + config.height + ")")
        .attr("fill", function(d) { return colorScale(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d})
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 0.9)



}

function initBarGraveMortel(g, data, config, colorScale){
    const subgroups = data.columns.slice(2)

    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([config.height, 0]);


    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    const rect = d3.select('#rect2')
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return colorScale(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d})
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 0.9)
}


function showBarChartAll(g, data, config, colorScale){
    const subgroups = data.columns.slice(1)

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ 0, -config.height]);

    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    d3.select('#rect1')
        .selectAll('rect')
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 1)
        .transition()
        .delay(0)
        .attr("y", function(d) { return y(d[1]) })
        .attr("height", function(d) {return y(d[0]) - y(d[1])})


}

function hideBarChartAll(g, data, config, colorScale){
    const subgroups = data.columns.slice(1)

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ 0, -config.height]);


    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    d3.select('#rect1')
        .selectAll('rect')
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 0)
        .transition()
        .delay(500)
        .attr("y", function(d) { return 0 })
        .attr("height", function(d) {return 0})
}

function showGraveMortel(g, data, config, colorScale){
    const subgroups = data.columns.slice(2)

    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([config.height, 0]);


    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    const rect = d3.select('#rect2')
        .selectAll('rect')
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 1)
        .transition()
        .delay(0)
        .attr("y", function(d) { return y(d[1]) })
        .attr("height", function(d) {return y(d[0]) - y(d[1])})

}

function hideGraveMortel(g, data, config, colorScale){
    const subgroups = data.columns.slice(2)

    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([config.height, 0]);


    var x = d3.scaleBand()
        .domain(['CAMION', 'SANS_CAMION'])
        .range([0, config.width])
        .padding([0.2])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    d3.select('#rect2')
        .selectAll('rect')
        .attr("x", function(d) { return x(d.data.TYPE_VEHICULE); })
        .attr("width",x.bandwidth())
        .style('opacity', 0)
        .transition()
        .delay(500)
        .attr("y", function(d) { return 0 })
        .attr("height", function(d) {return 0})




}

export function step1BarChart(g, data, config, color){
    hideGraveMortel(g, data, config, color)
    showBarChartAll(g, data, config, color)

}

export function step2BarChart(g, data, config, color){
    hideBarChartAll(g, data, config, color)
    showGraveMortel(g, data, config, color)
}

