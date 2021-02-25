// Do something nice

// test data with just a few data points for testing purposes

const init = () => {
  let lc

  d3.csv('/data/temp_data2.csv').then((data) => {
    // console.log(data)

    let countryArr = data.map((item) => item.country_name).filter((value, index, self) => self.indexOf(value) === index)
    // console.log(countryArr)

    // let selectBox = document.getElementById('countrySelector').options
    // // console.log(selectBox)
    // countryArr.forEach((option) => selectBox.add(new Option(option)))

    // let selected = document.getElementById('countrySelector').value
    // console.log(selected)

    lineChart(data, countryArr)
    // parseData(data);
  })
}

init()
