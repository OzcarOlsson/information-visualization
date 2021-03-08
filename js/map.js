function map(temperature_data, country_data, continent_data) {
  const yearRange = [...new Set(temperature_data.map((item) => item.year))]
  let sliderYear = '1961' // 1961-2019

  let mapSelection = {
    //init:
    name: 'country',
    data: country_data,
  }

  // Selection of map-data
  d3.select('#countryButton').on('click', () => {
    mapSelection.name = 'country'
    mapSelection.data = country_data
    updateMap(sliderYear, mapSelection)
  })

  d3.select('#continentButton').on('click', () => {
    mapSelection.name = 'continent'
    mapSelection.data = continent_data
    updateMap(sliderYear, mapSelection)
  })

  var updatedTempData = parseData(sliderYear) // init

  function parseData(year) {
    var temp = []
    temperature_data.forEach(function (d) {
      if (d.year == year) {
        temp[d.country_code] = d
      }
    })
    return temp
  }

  mapDiv = d3.select('#map').node()

  var zoom = d3.zoom().scaleExtent([0.5, 8]).on('zoom', zoomed)

  var margin = { top: 20, left: 20, right: 20, bottom: 20 },
    width = mapDiv.clientWidth - margin.right - margin.left,
    // height = mapDiv.clientHeight - margin.top - margin.bottom;
    height = 1000

  // Set map projection - round to flat
  var projection = d3
    .geoMercator()
    .translate([width * 0.5, height * 0.7])
    .scale(220)

  var svg = d3.select('#map').append('svg').attr('height', height).attr('width', width).call(zoom).append('g')

  // Create path using the projection
  var path = d3.geoPath().projection(projection)

  // Iterate Topo-data and add data about each country at chosen year
  function topoCountries(updatedTempData, mapSelection) {
    let map

    if (mapSelection.name == 'country') {
      map = topojson.feature(mapSelection.data, mapSelection.data.objects.countries).features.map(function (data) {
        data.properties = updatedTempData[data.id]
        return data
      })
    } else {
      map = topojson.feature(mapSelection.data, mapSelection.data.objects.continent).features.map(function (data) {
        data.properties = updatedTempData[data.properties.id]
        return data
      })
    }
    return map
  }

  const temp_range = [-0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3]
  const color_legend = d3.scaleThreshold().range(['#FFFFB7', '#FFCE03', '#FD9A01', '#FD6104', '#FF2C05', '#F00505']).domain(temp_range)

  let worldMap = svg
    .selectAll('path')
    .data(topoCountries(updatedTempData, mapSelection))
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', function (d) {
      const value = d.properties
      if (value) {
        return color_legend(d.properties.value)
      } else {
        return '#D3D3D3'
      }
    })
    .style('stroke', '#000')
    .style('stroke-width', '0.1')
    .on('mouseover', function (d) {
      d3.select(this).classed('selected', true)
      if (!d.properties) {
        return
      }
      mouseOn(updatedTempData[d.properties.country_code], mapSelection)
    })
    .on('mouseout', function (d) {
      d3.select(this).classed('selected', false)
      mouseOff()
    })

  // Define the div for the tooltip
  var div = d3.select('#map').append('div').attr('class', 'tooltip').style('opacity', 0)

  function mouseOn(cData, mapSelection) {
    if (!cData) {
      return
    } else {
      let name = ''
      if (mapSelection.name == 'country') {
        name = 'Country'
      } else if (mapSelection.name == 'continent') {
        name = 'Continent'
      }
      div.transition().duration(200).style('opacity', 0.9)
      div
        .html(name + ': ' + cData.country_name + '<br/>' + 'Temp. change: ' + cData.value)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    }
  }

  function mouseOff() {
    div.transition().duration(500).style('opacity', 0)
    d3.select('tooltip').remove()
  }

  function zoomed() {
    const currentTransform = d3.event.transform
    svg.attr('transform', currentTransform)
  }

  // slider
  var min_year = yearRange[0],
    max_year = yearRange.slice(-2)[0]

  var sliderSvg = d3.select('#timeSlider'),
    margin = { left: 500, top: 100 },
    width = 1000, //sliderSvg.attr("width") + margin.left,
    height = 150 //sliderSvg.attr("height") + margin.top;

  var x = d3.scaleLinear().domain([min_year, max_year]).range([0, width]).clamp(true)

  var slider = sliderSvg
    .append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(' + margin.left + ',' + height / 2 + ')')

  slider
    .append('line')
    .attr('class', 'track')
    .attr('x1', x.range()[0])
    .attr('x2', x.range()[1])
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true))
    })
    .attr('class', 'track-inset')
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true))
    })
    .attr('class', 'track-overlay')
    .call(
      d3
        .drag()
        .on('start.interrupt', function () {
          slider.interrupt()
        })
        .on('start drag', function () {
          currentValue = d3.event.x
          sliderYear = Math.round(x.invert(currentValue))
          updateMap(sliderYear, mapSelection)
        })
    )

  slider
    .insert('g', '.track-overlay')
    .attr('class', 'ticks')
    .attr('transform', 'translate(0,' + 25 + ')')
    .selectAll('text')
    .data(x.ticks(10))
    .enter()
    .append('text')
    .attr('x', x)
    .attr('text-anchor', 'middle')
    .text(function (d) {
      return d
    })

  var handle = slider.insert('circle', '.track-overlay').attr('class', 'handle').attr('r', 12)

  var label = slider
    .append('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .text(sliderYear)
    .attr('transform', 'translate(0,' + -25 + ')')

  function updateMap(sliderYear, mapSelection) {
    handle.attr('cx', x(sliderYear))

    label.attr('x', x(sliderYear)).text(sliderYear)

    updatedTempData = parseData(sliderYear)

    // draw new on update/onchange
    worldMap.remove()

    worldMap = svg
      .selectAll('path')
      .data(topoCountries(updatedTempData, mapSelection))
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', function (d) {
        const value = d.properties
        if (value) {
          return color_legend(d.properties.value)
        } else {
          return '#D3D3D3'
        }
      })
      .style('stroke', '#000')
      .style('stroke-width', '0.1')
      .on('mouseover', function (d) {
        d3.select(this).classed('selected', true)
        if (!d.properties) {
          return
        }
        mouseOn(updatedTempData[d.properties.country_code], mapSelection)
      })
      .on('mouseout', function (d) {
        d3.select(this).classed('selected', false)
        mouseOff()
      })
  }
}
