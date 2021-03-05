// Do something nice

// test data with just a few data points for testing purposes

const init = () => {
  let lc
  let cl

  d3.csv('/data/temp_data2.csv').then((data) => {
    let countryArr = data.map((item) => item.country_name).filter((value, index, self) => self.indexOf(value) === index)

    cl = new mychart(data, countryArr)

    lc = new lineChart(data, countryArr)
  })
}

init()
