// Do something nice

// test data with just a few data points for testing purposes

const init = () => {
  let lc
  let cl

  d3.csv('/data/t_data.csv').then((data) => {
    let countryArr = data.map((item) => item.country_name).filter((value, index, self) => self.indexOf(value) === index)

    cl = new mychart2(data, countryArr)

    lc = new lineChart(data, countryArr)
  })
}

init()
