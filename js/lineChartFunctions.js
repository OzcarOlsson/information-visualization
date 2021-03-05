function parseData(d, selectedCountry) {
  let temp = []
  for (let i = 0; i < d.length; i++) {
    if (d[i].country_name == selectedCountry) {
      temp.push({
        dt: new Date(d[i].year),
        avgTemp: +d[i].value,
        country: d[i].country_name,
      })
    }
  }
  return temp
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

// Setup legend for chart
function legendSetup(legendContent, data, line, lsLine, x, y, svg, selectedOption, updateType) {
  if (legendContent == 'main') {
    //Legend
    d3.select('#legend').append('circle').attr('cx', 20).attr('cy', 20).attr('r', 5).style('fill', '#ffab00')

    d3.select('#legend')
      .append('text')
      .attr('class', 'legend-first-text')
      .attr('x', 30)
      .attr('y', 25)
      .style('cursor', 'pointer')
      .text(selectedOption)
      .on('click', () => {
        // visOptions.firstLine = !visOptions.firstLine
        let choice = d3.select('#selectButton').property('value')
        updateType.name = 'redraw'
        updateType.mainLine = !updateType.mainLine
        update(choice, data, line, lsLine, x, y, svg, updateType)
        d3.select('.legend-first-text').style('opacity', updateType.mainLine ? 1.0 : 0.5)
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
        let choice = d3.select('#selectButton').property('value')
        updateType.name = 'redraw'
        updateType.mainRegression = !updateType.mainRegression
        update(choice, data, line, lsLine, x, y, svg, updateType)
        d3.select('.legend-regression-text').style('opacity', updateType.mainRegression ? 1.0 : 0.5)
      })
  } else if (legendContent == 'compare') {
    d3.select('#legend')
      .append('circle')
      .attr('class', 'legend-second-circle')
      .attr('cx', 20)
      .attr('cy', 60)
      .attr('r', 5)
      .style('fill', 'black')
    // TODO FIX
    d3.select('#legend')
      .append('text')
      .attr('class', 'legend-second-text')
      .attr('x', 30)
      .attr('y', 65)
      .style('cursor', 'pointer')
      .text(selectedOption)
      .on('click', () => {
        let choice = d3.select('#compareSelect').property('value')
        updateType.name = 'redraw'
        updateType.compare = !updateType.compare
        updateCompareLine(choice, data, line, lsLine, x, y, svg, updateType)
        d3.select('.legend-second-text').style('opacity', updateType.compare ? 1.0 : 0.5)
      })

    d3.select('#legend')
      .append('rect')
      .attr('class', 'legend-second-rect')
      .attr('x', 15)
      .attr('y', 80)
      .attr('width', 10)
      .attr('height', 2)
      .style('fill', 'blue')
    d3.select('#legend')
      .append('text')
      .attr('class', 'legend-second-regression-text')
      .attr('x', 30)
      .attr('y', 85)
      .text('Linear Regression')
      .style('cursor', 'pointer')
      .on('click', () => {
        let choice = d3.select('#compareSelect').property('value')
        updateType.name = 'redraw'
        updateType.compareRegression = !updateType.compareRegression
        updateCompareLine(choice, data, line, lsLine, x, y, svg, updateType)
        d3.select('.legend-second-regression-text').style('opacity', updateType.compareRegression ? 1.0 : 0.5)
      })
  }
}

function futurePredMode() {
  d3.selectAll('.dot2').remove()
  d3.selectAll('.secondLine').remove()
  d3.select('#compareSelect').property('disabled', 'true').property('value', 'None')
  d3.select('.legend-second-rect').remove()
  d3.select('.legend-second-circle').remove()
  d3.select('.legend-second-text').remove()
  d3.select('.legend-second-regression-text').remove()
}

function handleMouseIn(d, i) {
  d3.select(this).attr('r', 10)
  // info

  d3.select('#graphContainer')
    .append('div')
    .datum(d)
    .attr('class', 'textBox')
    .style('transform', `translate(${d3.event.x + 'px'} , ${d3.event.y + 'px'})`)
    .append('p')
    .attr('class', 'boxInfo')
    .text((d) => {
      return 'Year: ' + d.dt.getFullYear()
    })
    .append('p')
    .text((d) => {
      return 'Tempchange: ' + d.avgTemp.toFixed(2)
    })
}

function handleMouseOut(d) {
  d3.select(this).attr('r', 5)

  d3.select('.textBox').remove()
  d3.select('#t').remove()
}

// Future prediciton
function futurePred(selectedData, x, y, svg) {
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
  let xAxis = d3.axisBottom(x)
  let yAxis = d3.axisLeft(y)
  svg.select('.x-axis').transition().duration(1500).call(xAxis)
  svg.select('.y-axis').transition().duration(1500).call(yAxis)

  // Draw line
  let predLineData = [res[0], res[size - 1]]
  return predLineData
}
