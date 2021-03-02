// DUMMY STUFF

// 12. Appends a circle for each datapoint
// svg
//   .selectAll(".dot")
//   .data(dataset)
//   .enter()
//   .append("circle") // Uses the enter().append() method
//   .attr("class", "dot") // Assign a class for styling
//   .attr("cx", function (d, i) {
//     return xScale(i);
//   })
//   .attr("cy", function (d) {
//     return yScale(d.y);
//   })
//   .attr("r", 5);

// svg
//   .append('text')
//   .datum(d)
//   .attr('id', 't')
//   .attr('x', function (d) {
//     return x(d.dt)
//   })
//   .attr('y', (d) => {
//     return y(d.avgTemp)
//   })
//   .text((d) => {
//     return [d.avgTemp.toFixed(2), d.dt.getFullYear()]
//   })

let dots = svg
  .selectAll('.dot')
  .data(data2)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', (d) => {
    return x(d.dt)
  })
  .attr('cy', (d) => {
    return y(d.avgTemp)
  })
  .attr('r', 5)
  .on('mouseover', handleMouseIn)
  .on('mouseout', handleMouseOut)

// draw first line
let line = svg
  .append('g')
  .append('path')
  .datum(data2)
  .attr(
    'd',
    d3
      .line()
      .x((d) => {
        return x(d.dt)
      })
      .y((d) => {
        return y(d.avgTemp)
      })
    // .curve(d3.curveMonotoneX) // More smuth
  )
  .attr('stroke', 'blue')
  .style('stroke-width', 2)
  .style('fill', 'none')

// update line
line
  .datum(temp)
  .transition()
  .duration(1000)
  .attr(
    'd',
    d3
      .line()
      .x((d) => {
        return x(d.dt)
      })
      .y((d) => {
        return y(d.avgTemp)
      })
  )
  .attr('stroke', 'blue')

// Update circles
let circ = svg.selectAll('.dot').data(temp)

circ
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', (d) => {
    return x(d.dt)
  })
  .attr('cy', (d) => {
    return y(d.avgTemp)
  })
  .attr('r', 5)
  .on('mouseover', handleMouseIn)
  .on('mouseout', handleMouseOut)

circ
  .transition()
  .duration(1000)
  .attr('cx', (d) => {
    return x(d.dt)
  })
  .attr('cy', (d) => {
    return y(d.avgTemp)
  })
  .attr('r', 5)

circ.exit().remove()

// LEGEND STUFF

d3.select('#legend text').text(selectedOption)
console.log(selectedOption.length)
d3.select('#legend').attr('width', 150)
d3.select('#legend text').style('font-size', '16px')
if (selectedOption.length > 15 && selectedOption.length < 23) {
  d3.select('#legend').attr('width', 200)
}
if (selectedOption.length > 23) {
  d3.select('#legend').attr('width', 260)
  if (selectedOption.length > 30) {
    d3.select('#legend text').style('font-size', '12px')
  } else {
    d3.select('#legend text').style('font-size', '14px')
  }
}

// Least-Square Line
let lsLine = svg
  .append('g')
  .append('path')
  .datum(leastSquareLine)
  .attr(
    'd',
    d3
      .line()
      .x((d) => {
        return x(d.xVal)
      })
      .y((d) => {
        return y(d.yVal)
      })
  )
  .attr('stroke', 'green')
  .style('stroke-width', 2)
  .style('full', 'none')
