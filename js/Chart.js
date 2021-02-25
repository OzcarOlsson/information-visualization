function chart(data, arr){
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
}