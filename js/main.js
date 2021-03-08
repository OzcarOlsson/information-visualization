queue()
  .defer(d3.csv, 'data/temp_data.csv')
  .defer(d3.json, 'data/countries-topo.json')
  .defer(d3.json, 'data/updated_continents.json')
  .defer(d3.csv, 'data/country_temp.csv')
  .await(function (error, temp_data, country_data, continent_data, country_temp) {
    if (error) {
      console.log('Something is wrong', error)
    } else {
      map = new map(temp_data, country_data, continent_data)
      let countryArr = temp_data.map((item) => item.country_name).filter((value, index, self) => self.indexOf(value) === index)
      cl = new mychart2(country_temp, countryArr)

      lc = new lineChart(temp_data, countryArr)
    }
  })
