//Update function for graph
function update(selectedOption, data, line, lsLine, x, y, svg, updateType) {
  // let secondLineData = updateType.compare ? d3.select('.secondLine')._groups[0][0].__data__[0].dt.getFullYear() : ''
  let newData = parseData(data, selectedOption)

  // Graph Headline
  let str = document.getElementById('graphHeadline').innerHTML
  if (str.includes('compared')) {
    let modifiedStr = str.split('compared')
    document.getElementById('graphHeadline').innerHTML = `Showing (${selectedOption}) compared ${modifiedStr[1]}`
  } else {
    document.getElementById('graphHeadline').innerHTML = `Showing (${selectedOption})`
  }

  //Legend update
  d3.select('#legend text').text(selectedOption)

  let lineData = updateType.mainLine ? newData : []
  // let lineData = temp
  if (updateType.name == 'redraw') {
    line
      .datum(lineData)
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
      .attr('stroke', '#ffab00')

    // Update sqLine
    let lsData = []
    if (updateType.mainRegression) {
      let rd = leastSquare(newData)
      lsData = [rd[0], rd[1]]
    } else if (updateType.futureLine) {
      lsData = futurePred(newData, x, y, svg)
    }

    // let nd = leastSquare(newData)
    // let lsData = updateType.mainRegression ? [nd[0], nd[1]] : []

    lsLine
      .datum(lsData)
      .transition()
      .duration(1000)
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

    let circ = svg.selectAll('.dot').data(lineData)

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
  }
}

function updateCompareLine(selectedOption, data, compareLine, compareLsLine, x, y, svg, updateType) {
  // let mainLineData = d3.select('.firstLine')._groups[0][0].__data__[0].dt.getFullYear()

  if (updateType.counter == 1 && updateType.name == 'init') {
    document.getElementById('graphHeadline').innerHTML += ` compared to  (${selectedOption})`
    let lineData = !updateType.FutureLine ? parseData(data, selectedOption) : []
    // Draw
    compareLine = svg
      .append('g')
      .attr('class', 'secondLine')
      .append('path')
      .datum(lineData)
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
      .attr('stroke', 'black')
      .style('stroke-dasharray', '3, 3')
      .style('fill', 'none')
      .style('opacity', 0.3)

    // Linear Regression Line
    let regressionData = []

    if (updateType.compareRegression && selectedOption != 'None' && !updateType.futureLine) {
      let rd = updateType.compareRegression ? leastSquare(parseData(data, selectedOption)) : []
      regressionData = [rd[0], rd[1]]

      console.log('Hej')
    } else if (updateType.futureLine) {
      regressionData = []
    }
    // let rd = leastSquare(lineData)
    // let regressionData = [rd[0], rd[1]]
    compareLsLine = svg
      .append('g')
      .attr('class', 'secondLine')
      .append('path')
      .datum(regressionData)
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
      .attr('stroke', 'blue')
      .style('stroke-width', 2)
      .style('full', 'none')

    // dots
    svg
      .selectAll('.dot2')
      .data(lineData)
      .enter()
      .append('circle')
      .attr('class', 'dot2')
      .attr('cx', (d) => {
        return x(d.dt)
      })
      .attr('cy', (d) => {
        return y(d.avgTemp)
      })
      .attr('r', 5)
      .on('mouseover', handleMouseIn)
      .on('mouseout', handleMouseOut)

    // Legend resizing
    d3.select('#second-text').text(selectedOption)
  } else if (updateType.name == 'redraw') {
    let str = document.getElementById('graphHeadline').innerHTML.split('compared')
    document.getElementById('graphHeadline').innerHTML = str[0] + ` compared to  (${selectedOption})`

    let newData = !updateType.compare || selectedOption === 'None' ? [] : parseData(data, selectedOption)

    // Update legend
    d3.select('#second-text').text(selectedOption)

    //Update second line
    compareLine
      .datum(newData)
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

    // Update 2nd Regression Line
    let regressionData = []
    if (updateType.compareRegression && selectedOption != 'None') {
      let rd = updateType.compareRegression ? leastSquare(parseData(data, selectedOption)) : []
      regressionData = [rd[0], rd[1]]
    }
    compareLsLine
      .datum(regressionData)
      .transition()
      .duration(1000)
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
      .attr('stroke', 'blue')
      .style('stroke-width', 2)
      .style('full', 'none')

    //update dots
    let circ = svg.selectAll('.dot2').data(newData)

    circ
      .enter()
      .append('circle')
      .attr('class', 'dot2')
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
  }

  return [compareLine, compareLsLine]
}

// Axis update
function updateAxis(data, x, y, svg, type) {
  //Rescale axes

  if (type == 'history') {
    x.domain(
      d3.extent(data, (d) => {
        return d.dt
      })
    )
    let xAxis = d3.axisBottom(x)
    svg.select('.x-axis').transition().duration(1500).call(xAxis)
  }
  y.domain(
    d3.extent(data, (d) => {
      return d.avgTemp
    })
  )
  let yAxis = d3.axisLeft(y)

  svg.select('.y-axis').transition().duration(1500).call(yAxis)
}
