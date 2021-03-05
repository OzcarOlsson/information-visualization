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

/// OLD STUFF
function lineChart(data, countryArr) {
  const data2 = parseData(data)

  let visOptions = {
    firstLine: true,
    secondLine: false,
    regLine: true,
    secondRegLine: true,
    futureLine: false,
    refresh: false,
  }

  const ls = leastSquare(data2)
  const leastSquareLine = [ls[0], ls[1]]

  let containerWidth = document.getElementById('graphContainer').offsetWidth
  let containerHeight = document.getElementById('graphContainer').offsetHeight
  let svgWidth = containerWidth - 50,
    svgHeight = containerHeight - 200
  // svgHeight = 800
  let margin = { top: 20, right: 20, bottom: 30, left: 50 }
  let width = svgWidth - margin.left - margin.right
  let height = svgHeight - margin.top - margin.bottom

  d3.select('#graphContainer').append('p').attr('id', 'graphHeadline').attr('style', 'margin-left: 10px').text('Showing (Sweden)')
  // Future prediciton
  d3.select('#futureButton').on('click', () => {
    // visOptions.firstLine = true
    // visOptions.secondLine = false
    // visOptions.regLine = false
    // visOptions.secondRegLine = false
    visOptions.futureLine = true
    let choice = d3.select('#selectButton').property('value')
    update(choice, visOptions)

    let compChoice = d3.select('#compareSelect').property('value')

    if (compChoice != 'None') compareLine(compChoice, visOptions)
  })

  d3.select('#historyButton').on('click', () => {
    visOptions.futureLine = false
    visOptions.refresh = true
    let choice = d3.select('#selectButton').property('value')
    update(choice, visOptions)
    // compareLine('', visOptions)
  })

  let svg = d3
    .select('#graphContainer')
    .append('svg')
    .attr('class', 'lineChart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  //Legend
  d3.select('#legend').append('circle').attr('cx', 20).attr('cy', 20).attr('r', 5).style('fill', '#ffab00')

  d3.select('#legend')
    .append('text')
    .attr('class', 'legend-first-text')
    .attr('x', 30)
    .attr('y', 25)
    .style('cursor', 'pointer')
    .text('Sweden')
    .on('click', () => {
      visOptions.firstLine = !visOptions.firstLine
      let choice = d3.select('#selectButton').property('value')
      d3.select('.legend-first-text').style('opacity', visOptions.firstLine ? 1.0 : 0.5)
      update(choice, visOptions)
    })

  d3.select('#legend').append('rect').attr('x', 15).attr('y', 40).attr('width', 10).attr('height', 2).style('fill', 'green')
  d3.select('#legend')
    .append('text')
    .attr('class', 'legend-regression-text')
    .attr('x', 30)
    .attr('y', 45)
    .text('Linear Regression')
    .style('cursor', 'pointer')
    .on('click', () => {
      visOptions.regLine = !visOptions.regLine
      let choice = d3.select('#selectButton').property('value')

      d3.select('.legend-regression-text').style('opacity', visOptions.regLine ? 1.0 : 0.5)
      update(choice, visOptions)
    })

  // Select countries option
  d3.select('#selectButton')
    .selectAll('myOptions')
    .data(countryArr)
    .enter()
    .append('option')
    .text((d) => {
      return d
    })
    .attr('value', (d) => {
      return d
    })

  // Compare list of countries
  d3.select('#compareSelect')
    .selectAll('myOptions')
    .data(countryArr)
    .enter()
    .append('option')
    .text((d) => {
      return d
    })
    .attr('value', (d) => {
      return d
    })

  // Axis
  let x = d3.scaleTime().rangeRound([0, width])
  let y = d3.scaleLinear().rangeRound([height, 0])
  let xAxis = d3.axisBottom(x)
  let yAxis = d3.axisLeft(y)

  x.domain(
    d3.extent(data2, (d) => {
      return d.dt
    })
  )
  y.domain(
    d3.extent(data2, (d) => {
      return d.avgTemp
    })
  )

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .select('.domain')
    .remove()

  svg
    .append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '12pt')
    .attr('text-anchor', 'end')
    .text('Temp °C')

  // Line
  let line = svg
    .append('g')
    .append('path')
    .attr('class', 'firstLine')
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
    .attr('stroke', '#ffab00')
    .style('stroke-dasharray', '3, 3')
    .style('fill', 'none')
    .style('opacity', 0.5)

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

  // add dots for each data point
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

  let selectElement = document.querySelector('#countryTable')

  selectElement.querySelectorAll('p.country').forEach((row) => {
    row.addEventListener('click', (e) => {
      update(e.target.id, visOptions)
    })
  })

  // Update main graph
  function update(selectedOption, visOpt) {
    let temp = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].country_name == selectedOption) {
        temp.push({
          dt: new Date(data[i].year),
          avgTemp: +data[i].value,
          country: data[i].country_name,
        })
      }
    }

    if (visOpt.futureLine) {
      futurePred(temp)
    } else {
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

      if (visOpt.refresh) {
        // Axis update
        // Rescale axes
        x.domain(
          d3.extent(temp, (d) => {
            return d.dt
          })
        )
        y.domain(
          d3.extent(temp, (d) => {
            return d.avgTemp
          })
        )
      }

      svg.select('.x-axis').transition().duration(1500).call(xAxis)
      svg.select('.y-axis').transition().duration(1500).call(yAxis)

      let lineData = visOpt.firstLine ? temp : []
      // let lineData = temp

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
      let nd = leastSquare(temp)
      let newData = visOpt.regLine ? [nd[0], nd[1]] : []

      lsLine
        .datum(newData)
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

  // Onchange event for dropdown list with countries
  d3.select('#selectButton').on('change', function () {
    let selectedOption = d3.select(this).property('value').toString()
    update(selectedOption, visOptions)
  })

  let line2, lsLine2
  let counter = 0
  // Line for the country to compare with defaults to none
  function compareLine(selectedCompare, visOpt) {
    let temp = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].country_name == selectedCompare) {
        temp.push({
          dt: new Date(data[i].year),
          avgTemp: +data[i].value,
          country: data[i].country_name,
        })
      }
    }

    if (visOpt.futureLine && counter != 0) {
      futurePred(temp)
    }

    if (counter == 0 && !visOpt.futureLine) {
      document.getElementById('graphHeadline').innerHTML += ` compared to  (${selectedCompare})`

      //Legend
      d3.select('#legend').append('circle').attr('cx', 20).attr('cy', 60).attr('r', 5).style('fill', 'black')

      d3.select('#legend')
        .append('text')
        .attr('id', 'second-text')
        .attr('x', 30)
        .attr('y', 65)
        .style('cursor', 'pointer')
        .text(selectedCompare)
        .on('click', () => {
          visOpt.secondLine = !visOpt.secondLine
          let choice = d3.select('#compareSelect').property('value')
          compareLine(choice, visOpt)
        })

      d3.select('#legend').append('rect').attr('x', 15).attr('y', 80).attr('width', 10).attr('height', 2).style('fill', 'blue')
      d3.select('#legend')
        .append('text')
        .attr('class', 'legend-second-regression-text')
        .attr('x', 30)
        .attr('y', 85)
        .text('Linear Regression')
        .style('cursor', 'pointer')
        .on('click', () => {
          let choice = d3.select('#compareSelect').property('value')
          visOpt.secondRegLine = !visOpt.secondRegLine
          compareLine(choice, visOpt)
        })
    } else if (!visOpt.futureLine) {
      let str = document.getElementById('graphHeadline').innerHTML.split('compared')
      document.getElementById('graphHeadline').innerHTML = str[0] + ` compared to  (${selectedCompare})`

      d3.select('#second-text').style('opacity', visOpt.secondLine ? 1.0 : 0.5)

      d3.select('.legend-second-regression-text').style('opacity', visOpt.secondRegLine ? 1.0 : 0.5)
    }

    // Draw line first time
    let lineData = visOptions.secondLine ? temp : []
    if (counter == 0 && !visOpt.futureLine) {
      line2 = svg
        .append('g')
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
      let rd = leastSquare(temp)
      let regressionData = [rd[0], rd[1]]
      lsLine2 = svg
        .append('g')
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
      d3.select('#second-text').text(selectedCompare)

      if (selectedCompare.length > 15 && selectedCompare.length < 23) {
        d3.select('#legend').attr('width', 200)
      }
      if (selectedCompare.length > 23) {
        d3.select('#legend').attr('width', 260)
        if (selectedCompare.length > 30) {
          d3.select('#legend text').style('font-size', '12px')
          d3.select('#second-text').style('font-size', '12px')
        } else {
          d3.select('#legend text').style('font-size', '14px')
          d3.select('#second-text').style('font-size', '14px')
        }
      }

      counter++
      visOptions.secondLine = true
    } else if (!visOpt.futureLine) {
      // Update legend
      d3.select('#second-text').text(selectedCompare)

      if (selectedCompare.length > 15 && selectedCompare.length < 23) {
        d3.select('#legend').attr('width', 200)
      }
      if (selectedCompare.length > 23) {
        d3.select('#legend').attr('width', 260)
        if (selectedCompare.length > 30) {
          d3.select('#legend text').style('font-size', '12px')
          d3.select('#second-text').style('font-size', '12px')
        } else {
          d3.select('#legend text').style('font-size', '14px')
          d3.select('#second-text').style('font-size', '14px')
        }
      }

      //Update second line
      // console.log(lineData)
      line2
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

      // Update 2nd Regression Line
      let rd = leastSquare(temp)
      let regressionData = visOpt.secondRegLine ? [rd[0], rd[1]] : []
      lsLine2
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
      let circ = svg.selectAll('.dot2').data(lineData)

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
  }

  d3.select('#compareSelect').on('change', function () {
    let selectedCompare = d3.select(this).property('value').toString()
    compareLine(selectedCompare, visOptions)
  })

  // Future prediciton
  function futurePred(selectedData) {
    let lsData = leastSquare(selectedData)
    let km = lsData[2]

    let _x, _y
    let size = 31
    let year = 2020
    let res = []

    for (let i = 0; i < size; ++i) {
      _x = year
      _y = _x * km.kVal + km.mVal

      res.push({
        xVal: new Date(_x.toString()),
        yVal: +_y,
      })
      year++
    }

    // Rescale axes
    x.domain(
      d3.extent(res, (d) => {
        return d.xVal
      })
    )
    y.domain(
      d3.extent(res, (d) => {
        return d.yVal.toFixed(2)
      })
    )

    svg.select('.x-axis').transition().duration(1500).call(xAxis)
    svg.select('.y-axis').transition().duration(1500).call(yAxis)

    // Draw line
    let predLineData = [res[0], res[size - 1]]

    if (visOptions.secondLine) {
      svg.selectAll('.dot2').remove()
      line2.remove()
      lsLine2
        .datum(predLineData)
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
    }
    svg.selectAll('.dot').remove()
    line
      .datum([])
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

    lsLine
      .datum(predLineData)
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
  }
}

function leastSquare(parsedData) {
  const values = parseValues(parsedData)

  function parseValues(d) {
    let values = []
    let yValues = d.map((item) => {
      return item.avgTemp
    })
    let xValues = d.map((item) => {
      return new Date(item.dt).getFullYear()
    })
    values.push(xValues, yValues)

    return values
  }

  // Calculating the least square line y = kx + m for the values
  function calculateLeastSquare(xValues, yValues) {
    let xSum = 0,
      ySum = 0,
      xySum = 0,
      xxSum = 0,
      counter = 0
    let y = 0,
      x = 0
    let dataLength
    if (xValues.length != yValues.length) throw new Error('Different sizes of x and y array')
    if (xValues.length > 0) {
      dataLength = xValues.length
    } else {
      // return empty 2D array
      return [[], []]
    }

    // Calc x and y sum
    for (let i = 0; i < dataLength; ++i) {
      x = xValues[i]
      y = yValues[i]
      xSum += x
      ySum += y
      xxSum += x * x
      xySum += x * y
      counter++
    }

    // Calculate k and m in y = kx + m
    let k = (counter * xySum - xSum * ySum) / (counter * xxSum - xSum * xSum)

    let m = ySum / counter - (k * xSum) / counter
    // Returning the x and y data points
    let res = []

    for (let i = 0; i < dataLength; ++i) {
      x = xValues[i]
      y = x * k + m

      res.push({
        xVal: new Date(x.toString()),
        yVal: +y,
      })
    }

    let km = { kVal: k, mVal: m }

    let lastSlot = res.length - 1
    let resultLine = [res[0], res[lastSlot], km]

    // Return first and last slot to avoid rounding error
    return resultLine
  }

  return calculateLeastSquare(values[0], values[1])
}
