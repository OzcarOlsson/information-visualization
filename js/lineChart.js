function lineChart(data, countryArr) {
  // console.log(data);
  // console.log("hej från linechart");

  const data2 = parseData(data)

  function parseData(d) {
    let temp = []
    for (let i = 0; i < d.length; i++) {
      if (d[i].country_name == 'Sweden') {
        temp.push({
          dt: new Date(d[i].year),
          avgTemp: +d[i].value,
        })
      }
    }
    return temp
  }

  let svgWidth = 1600,
    svgHeight = 800
  let margin = { top: 20, right: 20, bottom: 30, left: 50 }
  let width = svgWidth - margin.left - margin.right
  let height = svgHeight - margin.top - margin.bottom

  let svg = d3.select('#graphContainer').append('svg').attr('class', 'line-chart').attr('width', svgWidth).attr('height', svgHeight)
  let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let x = d3.scaleTime().rangeRound([0, width])

  let y = d3.scaleLinear().rangeRound([height, 0])

  let line = d3
    .line()
    .x((d) => {
      return x(d.dt)
    })
    .y((d) => {
      return y(d.avgTemp)
    })
  // .curve(d3.curveMonotoneX); // More smuth

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

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .select('.domain')
    .remove()

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '12pt')
    .attr('text-anchor', 'end')
    .text('Temp (C)')

  g.append('path')
    .datum(data2)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line)
  // }

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

  // console.log(hej.select('#selectButton'))
  d3.select('#selectButton').on('change', function () {
    let selectedOption = d3.select(this).property('value').toString()
    update(selectedOption)
  })

  function update(selectedOption) {
    console.log(selectedOption)

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
    // console.log(temp)

    g.datum(temp)
      .attr('d', d3.line())
      .x((d) => {
        return x(d.dt)
      })
      .y((d) => {
        return y(d.avgTemp)
      })
      .attr('stroke', 'blue')
  }

  // draw(newArr);
}
