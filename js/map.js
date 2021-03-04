function map(world_data, temp_data){
    
    const yearRange = [...new Set(temp_data.map(item => item.year))];
    
    var countryData = parseData("1968"); // init

    function parseData(year) {
        var temp = []
        console.log("year i parsen: ", year)
        temp_data.forEach(function(d) { 
            if((d.year) == year){
                temp[d.country_code] = d;
            }
        })    
        return temp;
    }

    mapDiv = d3.select("#map").node()

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", zoomed);
    
    var margin = { top: 20, left: 20, right: 20, bottom: 20},
    width = mapDiv.clientWidth - margin.right - margin.left,
    height = mapDiv.clientHeight - margin.top - margin.bottom;
    
    // Set map projection - round to flat
    var projection = d3.geo.mercator()
        .translate([width * 0.5, height * 0.6])
        .scale(120);
    
    var svg = d3.select("#map").append("svg")
        .attr("height", height)
        .attr("width", width)
        .call(zoom)
        .append("g");
    
    // Create path using the projection
    var path = d3.geo.path()
        .projection(projection); 

    // Iterate Topo-data and add data about each country at chosen year      
    function topoCountries(countryData) {
        let countries = topojson
            .feature(world_data, world_data.objects.countries)
            .features.map(function(data) {
                data.properties = countryData[data.id];
                return data 
            });    
        return countries;
    }
    
    const temp_range = [-0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
    const color_legend = d3.scaleThreshold()
        .range(["#FFFFB7", "#FFCE03", "#FD9A01","#FD6104","#FF2C05","#F00505"])
        .domain(temp_range);

    let mapTest = svg.selectAll("path")
        .data(topoCountries(countryData))
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d){
            const value = d.properties; 
            if (value) {
                return color_legend(d.properties.value) 
            } else {
                return "#D3D3D3";
            }
        })
        .style('stroke', '#000')
        .style('stroke-width', '0.1')
        // .on("mouseover", function(d) {
        //     d3.select(this).classed("selected", true)
        //     //console.log(countries[d.id]);
        // })
        // .on("mouseout", function(d) {
        //     d3.select(this).classed("selected", false)
        // })

    function zoomed() {
        var tMap = d3.event.translate;
        var sMap = d3.event.scale;
        zoom.translate(tMap);
        svg.attr("transform", "translate(" + tMap + ")scale(" + sMap + ")");
    }
    

    var min_year = yearRange[0],
        max_year = yearRange.slice(-2)[0];

    // slider
    d3.select("#timeSlider")
        .attr("type", "range")
        .attr("min", min_year)
        .attr("max", max_year)
        .attr("step", "1")
        .attr("id", "year")    
        .on("input", () => {
            update();
        })

    function update() {
        var sliderYear = document.getElementById("year").value;
        updatedCountryData = parseData(sliderYear)
        
        // draw new on update/onchange
        mapTest.remove()

        mapTest = svg.selectAll("path")
            .data(topoCountries(updatedCountryData))
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d){
                //console.log(d);
                const value = d.properties; 
                if (value) {
                    return color_legend(d.properties.value) 
                } else {
                    return "#D3D3D3";
                }
            })
            .style('stroke', '#000')
            .style('stroke-width', '0.1')

    }




}


// Load and display countries
// d3.json("data/countries-topo.json", function (error, world) {
//     if (error) console.log(error);

//     var countries = topojson.feature(world, world.objects.countries).features;
//     //console.log(countries);
    
//     svg.selectAll("path")
//         .data(countries)
//         .enter().append("path")
//         .attr("d", path)
//         .on("mouseover", function(d) {
//             d3.select(this).classed("selected", true)
//         })
//         .on("mouseout", function(d) {
//             d3.select(this).classed("selected", false)
//         })
// });

// Load temperature data
// d3.csv("data/temp_data.csv", function (error, data) {
//     if (error) console.log(error);
//     console.log("csv data:", data)
// })

// --- Other solution on map --- //
// var mymap = L.map('map').setView([10, 0], 1);

// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(mymap);

