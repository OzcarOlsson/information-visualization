// Do something nice
const ls = "hej";

let k;

d3.csv("/data/temp_data.csv", function(d) {
    return {
        country_name : d.country_name,
        year : d.year,
        value : storeTemp(d.value),
        country_code : d.country_code,
        
    
    };
  }).then(function(data) {
     calcAvarage(data.temperatures);
     console.log(data[0]);
     k = data[0];
  });
console.log(ls);

var box = document.getElementById("bottomContainer");
box.textContent += " hej";

function calcAvarage(data){

    let o = 0;

    for (let i = 0; i < data.temperatures.length; i++) {
        // console.log(data.temperatures[i])
        o = parseFloat(data.temperatures[i]);
        // console.log(o);
    }
    o = o / data.temperatures.length;
    // console.log(o);
    
}


function storeTemp(data){
    let arr = [];
    let Y = 1961;
    let ind = "Y" + Y.toString(); 
    for (let i = 0; i < 58; i++) {
        
        if(data[ind]!=null){
            arr.push(data[ind])
            console.log(data[ind])
        }
        Y++;
        ind = "Y" + Y.toString(); 
    }
    return arr;
}

function storeTempDeviation(data){
    if(data.Element=="Temperature change"){
        let arr = [];
        let Y = 1961;
        let ind = "Y" + Y.toString(); 
        for (let i = 0; i < 58; i++) {
            
            if(data[ind]!=null){
                arr.push(data[ind])
            }
            Y++;
            ind = "Y" + Y.toString(); 
        }
        return arr;
    }
}