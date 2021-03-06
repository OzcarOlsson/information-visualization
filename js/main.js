// Do something nice
// const ls = "hej";
// console.log(ls);

queue()
    .defer(d3.csv, "data/temp_data.csv")
    .defer(d3.json, "data/countries-topo.json")
    .defer(d3.json, "data/updated_continents.json")
    .await(function (error, temp_data, country_data, continent_data) {
        if (error){
            console.log("Something is wrong", error);
        } else {
            map = new map(temp_data, country_data, continent_data)
        }
    })