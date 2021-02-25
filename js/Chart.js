function chart(data, arr){

    const data2 = parseData(data)

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
            let counter = 0;
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


    let a = document.getElementById("bottomContainer");

    a.textContent = ("Avarage temperature deviation for " + arr[0] + " is: " + parseFloat(y).toFixed(3) + "°C")


    


    //Calculates the indices that will be the n amount of highest deviations (for a time period k)
    function huh(){

    }

    for (let i = 1; i < 10; i++) {
        a.textContent += ("\n Avarage temperature deviation for " + arr[i] + " is: " + parseFloat(y[i]).toFixed(3) + "°C")
    }
    

    // console.log(data2);
}