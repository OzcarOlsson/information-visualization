function mychart(data, arr){

    let amtYears = 20;

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

    //y is an array that holds all the avarage deviations of the countries temperatures.
    let y = calcAvarage(data2);

    y.sort(function(a,b){return(b.tmp-a.tmp)})

    let printArr = [];
    let printCounter = 0;
    //Initiate an array that decides how many values we are going to print.
    for (let i = 0; i < y.length; i++) {
        if(printCounter > 20){
            break;
        }
        printArr.push(y[i])
        printCounter++;
    }

    let yearSpan = []
    //Create a new data entry point that returns the span between years.
    for (let i = 0; i < data2.length; i++) {
        if(data2[i].name==arr[0]){
            yearSpan.push(data2[i].dt.getFullYear());
        }
        else{
            break;
        }
    }
    
    let barHeight = 30;
    let width = 200;

    var x = d3.scaleLinear()
        .range([0, width]);


    //Select SVG-element with ID testClass
    let my = d3.select("#testClass")
    .selectAll("g")
    .data(printArr)
    .enter()
    .append("g")
    //Remove 1.04 for the spacing, thought it gave it some breathing.
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight * 1.04+ ")"; });

    //Create the gradient element that will fill out the deviation bar.
    let grad = my.append("defs").append("linearGradient").attr("id", "gradient");
    grad.append("stop").style("stop-color", "red").attr("offset", "0");
    grad.append("stop").style("stop-color", "red").attr("offset", "0.5");
    grad.append("stop").style("stop-color", "white").attr("offset", "1")
    .style("border-style", "solid")
    .style("border-width", "thin")
    
    
    
    //Create a rect-element and set width and height.
    my.append("rect")
      .attr("width", function(d) { return x(d.tmp/1.5); })
      .attr("height", barHeight - 1)
      .classed('filled', true)
      .style("stroke", "black")
      
      

    my.append("text")
    .text(function(d){return ((d.tmp).toFixed(3) + "°C")})
    // .attr("p", d.country + "  " + d.beginVal + " - " + (d.beginVal + d.Years- 1))
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style("font-family", "Arvo")
    // .attr("fill", "white");

    my.append("text").text(function(d){return d.country})
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style("font-family", "Arvo")
    .style("margin-left", "10px");

    my.style("justify-content", "space-evenly");


    function calcColor(){
        return "(250,50,50)"
    }
    

    let lel = d3.select("#StartSpan")
    .selectAll('option')
    .append('option')
    .data( yearSpan)
    .enter()
    .append('option')
    .text(function(d){
        return (d);
    })

    let lel2 = d3.select("#EndSpan")
    .selectAll('myOption')
    .append('option')
    .data(yearSpan)
    .enter()
    .append('option')
    .text(function(d){
        return (d);
    })

    function calcAvarage(d, years = d.length){

        let avg = [];
        let dummy = 0;
        let beginVal = 0;
        

        for(let j = 0; j < arr.length; j++){
            dummy = 0;
            let counter = 0;

            yearloop: 
            for (let i = d.length-1; i >= 0; i--) {
                
                if(d[i].name == arr[j]){
                    if(dummy==0){
                        beginVal = d[i].dt.getFullYear();
                    }

                    dummy += d[i].avgTemp;
                    counter++;
                }
                if(counter==20){
                    break yearloop;
                }

            }
            
            avg.push({tmp : (dummy /  counter), Years: counter, beginVal: beginVal, country : arr[j]}) ;
        }
        return avg;
    }

 }