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
