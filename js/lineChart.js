function lineChart(data, countryArr) {
  const data2 = parseData(data, 'World')
  const ls = leastSquare(data2)
  const leastSquareLine = [ls[0], ls[1]]

  let compareLine, compareLsLine
  let updateType = {
    name: 'redraw',
    counter: 0,
    mainLine: true,
    mainRegression: true,
    compare: false,
    compareRegression: false,
    futureLine: false,
    refresh: false,
  }

  let containerWidth = document.getElementById('graphContainer').offsetWidth
  let containerHeight = document.getElementById('graphContainer').offsetHeight
  let svgWidth = containerWidth - 50,
    svgHeight = containerHeight - 250
  // svgHeight = 800
  let margin = { top: 20, right: 20, bottom: 30, left: 50 }
  let width = svgWidth - margin.left - margin.right
  let height = svgHeight - margin.top - margin.bottom

  d3.select('#graphContainer').append('p').attr('id', 'graphHeadline').attr('style', 'margin-left: 10px').text('Showing (World)')
  // Future prediciton
  d3.select('#futureButton').on('click', () => {
    let choice = d3.select('#selectButton').property('value')
    updateType.futureLine = true
    updateType.mainLine = false
    updateType.mainRegression = false
    update(choice, data, line, lsLine, x, y, svg, updateType)
    futurePredMode()
    updateType.counter = 0
  })

  d3.select('#historyButton').on('click', () => {
    let choice = d3.select('#selectButton').property('value')
    updateType.futureLine = false
    updateType.mainLine = true
    updateType.mainRegression = true
    updateType.refresh = true
    updateAxis(parseData(data, choice), x, y, svg)
    update(choice, data, line, lsLine, x, y, svg, updateType)
    legendSetup('main', data, line, lsLine, x, y, svg, choice, updateType)
    historyMode()
  })

  d3.select('#historyButton').style('opacity', 0.5).style('cursor', 'default')
  document.getElementById('historyButton').disabled = true

  let svg = d3
    .select('#graphContainer')
    .append('svg')
    .attr('class', 'lineChart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
  // y.domain(
  //   d3.extent(data2, (d) => {
  //     return d.avgTemp
  //   })
  // )
  y.domain(d3.extent([-3, 4]))
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

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

  // Least square regression line
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

  legendSetup('main', data, line, lsLine, x, y, svg, 'World', updateType)

  let selectElement = document.querySelector('#bars-container')

  selectElement.querySelectorAll('div.temp-bar').forEach((row) => {
    row.addEventListener('click', (e) => {
      e.preventDefault()
      updateType.name = 'redraw'
      handleClick(e.target.id)
      update(e.target.id, data, line, lsLine, x, y, svg, updateType)
    })
  })
  // Onchange event for dropdown list with countries
  d3.select('#selectButton').on('change', function () {
    let selectedOption = d3.select(this).property('value').toString()
    updateType.name = 'redraw'
    update(selectedOption, data, line, lsLine, x, y, svg, updateType)
  })

  // Onchange event for compare country dropdown
  d3.select('#compareSelect').on('change', function () {
    let selectedCompare = d3.select(this).property('value').toString()
    if (selectedCompare == 'None') updateType.compare = false
    updateType.counter = ++updateType.counter
    if (updateType.counter == 1) {
      updateType.name = 'init'
      updateType.compare = true
      updateType.compareRegression = true
    } else {
      updateType.name = 'redraw'
    }
    let updateRes = updateCompareLine(selectedCompare, data, compareLine, compareLsLine, x, y, svg, updateType)
    compareLine = updateRes[0]
    compareLsLine = updateRes[1]
    if (updateType.counter == 1) {
      legendSetup('compare', data, compareLine, compareLsLine, x, y, svg, selectedCompare, updateType)
      updateType.name = 'redraw'
    }
  })
}
