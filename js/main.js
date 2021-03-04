// Do something nice
// const ls = "hej";
// console.log(ls);

queue()
    .defer(d3.json, "data/countries-topo.json")
    .defer(d3.csv, "data/temp_data.csv")
    .await(function (error, world_data, temp_data) {
        if (error){
            console.log("Something is wrong", error);
        } else {
            map = new map(world_data, temp_data)
        }
    })