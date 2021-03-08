function mychart2(data, arr) {
  let amtYears = 20

  let flag = false
  let maxVal

  let itrer = 4

  const data2 = parseData(data)

  //Parse the data to [YYYY-MM-DD, name, avarageTemperature]
  function parseData(d) {
    let temp = []

    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < d.length; i++) {
        if (d[i].country_name == arr[j]) {
          temp.push({
            name: d[i].country_name,
            dt: new Date(d[i].year),
            avgTemp: +d[i].value,
          })
        }
      }
    }
    return temp
  }

  //y is an array that holds all the avarage deviations of the countries temperatures.
  let y = calcAvarage(data2)

  y.sort(function (a, b) {
    return b.tmp - a.tmp
  })

  let printArr = []
  let printCounter = 0
  //Initiate an array that decides how many values we are going to print.
  for (let i = 0; i < y.length; i++) {
    if (printCounter > 100) {
      break
    }
    printArr.push(y[i])
    printCounter++
  }

  let yearSpan = []
  //Create a new data entry point that returns the span between years.
  for (let i = 0; i < data2.length; i++) {
    if (data2[i].name == arr[0]) {
      yearSpan.push(data2[i].dt.getFullYear())
    } else {
      break
    }
  }

  let barHeight = 37
  let width = 200

  var x = d3.scaleLinear().range([0, width])

  //Select SVG-element with ID testClass
  let my = d3
    .select('#bars-container')
    .selectAll('g')
    .data(printArr)
    .enter()
    .append('div')
    .attr('class', 'temp-bar')
    .attr('id', (d) => {
      return d.country
    })
    .style('width', (d) => {
      return `${x(d.tmp) / 1.2}px`
    })
    .style('height', '30px')
    .style('background-color', (d) => {
      let jj = calcColor(d.tmp)
      return `${jj}`
    })
  my.append('p')
    .attr('class', 'degrees')
    .attr('id', (d) => {
      return d.country
    })
    .text((d) => {
      return d.tmp.toFixed(3) + '°C'
    })

  let sizeFont = my.append('p')
  sizeFont
    .attr('class', 'country')
    .style('font-size', '14px')
    .attr('id', (d) => {
      return d.country.split(' ')[0]
    })
    .text((d) => {
      if (d.country == 'China, mainland') {
        d3.select(`#${d.country.split(',')[0]}`).style('font-size', '14px')
      } else {
        d3.select(`#${d.country.split(' ')[0]}`).style('font-size', '14px')
      }

      if (d.country.length > 17 && !d.country.includes('Svalbard')) {
        if (d.country.includes('Russian')) return d.country
        if (d.country.includes('Turks') || d.country.includes('Dominican')) {
          return d.country.substring(0, 10) + '...'
        }
        return d.country.substring(0, 16) + '...'
      }
      return d.country
    })

  //This function takes in the individual values of the temperatures.
  //The input is sorted from highest to lowest, so the first value will be the largest, therefore
  //it will set the maxvalue, which will return a more "reddish" color.
  function calcColor(dd) {
    let G = 0
    let R
    if (!flag) {
      maxVal = 255 / dd
      flag = true
      R = dd * maxVal * 2
      G = (dd * maxVal) / 4
    } else {
      // console.log(maxVal/dd);
      G = Math.pow(maxVal / (dd * 4), 1.8)
      R = Math.pow(dd * maxVal, 1.1)
    }
    let returnArr = []
    returnArr.push(R.toFixed(0))
    returnArr.push(G.toFixed(0))
    returnArr.push(0)

    let returnRGB = 'rgb(' + returnArr.join(',') + ')'
    return returnRGB
  }

  function calcAvarage(d, years = d.length) {
    let avg = []
    let dummy = 0
    let beginVal = 0

    for (let j = 0; j < arr.length; j++) {
      dummy = 0
      let counter = 0

      yearloop: for (let i = d.length - 1; i >= 0; i--) {
        if (d[i].name == arr[j]) {
          if (dummy == 0) {
            beginVal = d[i].dt.getFullYear()
          }

          dummy += d[i].avgTemp
          counter++
        }
        if (counter == 20) {
          break yearloop
        }
      }

      avg.push({
        tmp: dummy / counter,
        Years: counter,
        beginVal: beginVal,
        country: arr[j],
      })
    }
    return avg
  }
}
