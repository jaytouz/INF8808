import * as d3 from 'd3';

const titleFontSize = "calc(12px + 0.6vw)";
export function addTitle(g, title){
    const width = g.node().getBBox().width;

    let text = g.append('text')
        .text(title)
        .attr('class', 'graph-title')
    
    text
    .style("font-size", titleFontSize)
    .attr('x', (width - text.node().getBBox().width)/2)
    .attr('y', -2*text.node().getBBox().height);
    
}