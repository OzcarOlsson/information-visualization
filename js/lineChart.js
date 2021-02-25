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

  let containerWidth = document.getElementById('graphContainer').offsetWidth
  let containerHeight = document.getElementById('graphContainer').offsetHeight
  let svgWidth = containerWidth - 50,
    svgHeight = containerHeight - 200
  // svgHeight = 800
  let margin = { top: 20, right: 20, bottom: 30, left: 50 }
  let width = svgWidth - margin.left - margin.right
  let height = svgHeight - margin.top - margin.bottom

  let svg = d3
    .select('#graphContainer')
    .append('svg')
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

  d3.select('.selectionContainer').append('p').attr('id', 'graphHeadline').text('Showing Sweden')

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
    .text('Temp (C)')

  // Line
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

  function handleMouseIn(d, i) {
    d3.select(this).attr('r', 10)
    // info

    d3.select('#graphContainer')
      .append('div')
      .datum(d)
      .attr('class', 'textBox')
      .style('transform', `translate(${d3.event.x + 10 + 'px'} , ${d3.event.y + 10 + 'px'})`)
      .append('p')
      .attr('class', 'boxInfo')
      .text((d) => {
        return 'Year: ' + d.dt.getFullYear()
      })
      .append('p')
      .text((d) => {
        return 'Tempchange: ' + d.avgTemp.toFixed(2)
      })
    // console.log(s)
  }

  function handleMouseOut(d) {
    d3.select(this).attr('r', 5)

    d3.select('.textBox').remove()
    d3.select('#t').remove()
  }

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
    // console.log(textis.datum(selectedOption).attr('p').innerHTML)
    // textis.attr('p').text(selectedOption)

    let s = (document.getElementById('graphHeadline').innerHTML = `Showing ${selectedOption}`)
    console.log(s)
    // .innerHTML(`Showing ${selectedOption}`)
    line
      .datum(temp)
      .transition()
      .duration(500)
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

    let sa = svg.selectAll('.dot').datum(temp).remove().transition().duration(1000)

    svg
      .selectAll('.dot')
      .data(temp)
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
    // let sa = svg
    //   .selectAll('.dot')
    //   .data(temp, (d) => {
    //     return d.dt
    //   })
    //   .exit()
    //   .remove()
    // // console.log(circles)
    console.log(sa)
    // // circles.exit().remove()

    // sa.transition().duration(1000)

    // svg
    //   .selectAll('.dot')
    //   .data(temp)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'dot')
    //   .attr('cx', (d) => {
    //     return x(d.dt)
    //   })
    //   .attr('cy', (d) => {
    //     return y(d.avgTemp)
    //   })
    //   .attr('r', 5)

    // circles
    // 	.enter()
    // 	.append("circle")
    // 	.attr)""
  }

  d3.select('#selectButton').on('change', function () {
    let selectedOption = d3.select(this).property('value').toString()
    update(selectedOption)
  })
  // draw(newArr);
}
