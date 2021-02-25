function mychart(data, arr){

    const data2 = parseData(data)

    //Parse the data to [YYYY-MM-DD, name, avarageTemperature]
    function parseData(d) {
      let temp = []

      for(let j = 0; j < arr.length; j++){
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

    console.log(data2);

    //y is an array that holds all the avarage deviations of the countries temperatures.
    let y = calcAvarage(data2);

    function calcAvarage(d, years = d.length){

        let avg = [];
        let dummy = 0;
        
        for(let j = 0; j < arr.length; j++){
            dummy = 0;
            let counter = 0;
            //index i will start depending if sorting a specific interval. Might have to change this.
            for (let i = (d.length-years); i < d.length; i++) {
                if(d[i].name == arr[j]){
                    dummy += d[i].avgTemp;
                    counter++;
                }
            }
            
            avg[j] = dummy /  counter;
        }
        return avg;
    }

    //Initiate a map and add both the countries names and the calculated avarage temperature deviation.
    let myMap = new Map();

    for (let i = 0; i < arr.length; i++) {
        myMap.set(arr[i], y[i]);
    }


    //Sort the map based on the largest deviations.
    myMap = new Map([...myMap.entries()].sort(function(a,b){return b[1]-a[1]}));


    let a = document.getElementById("bottomContainer");
    a.textContent = "";

    let tempcounter = 0;
    let h = []
    for(const [key,value] of myMap.entries()){
        if(tempcounter > 9) break; 
        // a.textContent += ("\n Avarage temperature deviation for " + key + " is: " + parseFloat(value).toFixed(3) + "°C")
        
        h.push({country : key, temp: value});
        tempcounter++;
    }

    let width = 200,
    barHeight = 2;
    console.log(h)
    
    // console.log(myMap);

    let chart = d3.select("#testTable")
    .selectAll('myList')
    .append('li')
    .data(h)
    .enter()
    .append('li')
    .text(function(d){
        return (d.country + " : " + (d.temp).toFixed(3) + "°C");
    })

 }