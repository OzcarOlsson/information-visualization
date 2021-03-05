function map(world_data, temp_data){
    
    const yearRange = [...new Set(temp_data.map(item => item.year))];
    initYear = "1961"; // 1961-2019

    var countryData = parseData(initYear); // init

    function parseData(year) {
        var temp = []
        //console.log("year i parsen: ", year)
        temp_data.forEach(function(d) { 
            if((d.year) == year){
                temp[d.country_code] = d;
            }
        })    
        return temp;
    }

    mapDiv = d3.select("#map").node()

    var zoom = d3.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", zoomed);
    
    var margin = { top: 20, left: 20, right: 20, bottom: 20},
    width = mapDiv.clientWidth - margin.right - margin.left,
    height = mapDiv.clientHeight - margin.top - margin.bottom;
    
    // Set map projection - round to flat
    var projection = d3.geoMercator()
        .translate([width * 0.5, height * 0.6])
        .scale(120);
    
    var svg = d3.select("#map").append("svg")
        .attr("height", height)
        .attr("width", width)
        .call(zoom)
        .append("g");
    
    // Create path using the projection
    var path = d3.geoPath()
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
        const currentTransform = d3.event.transform;
        svg.attr("transform", currentTransform);
    }

    // slider
    var min_year = yearRange[0],
        max_year = yearRange.slice(-2)[0];
    
    let sliderYear = initYear;

    // var slider = d3.select("#timeSlider")
    //     .attr("type", "range")
    //     //.attr("class", "slider")
    //     .attr("min", min_year)
    //     .attr("max", max_year)
    //     .attr("step", "1")
    //     .attr("id", "year")    
    //     .on("input", () => {
    //         sliderYear = document.getElementById("year").value;
    //         //console.log("slidery", sliderYear);
    //         d3.select('#sliderYearValue').text(sliderYear);
    //         update(sliderYear);
    //     })

    var sliderSvg = d3.select("#timeSlider"),
        margin = {right: 100, left: 50, top: 150},
        width = 700, //svgHej.attr("width") - margin.left - margin.right,
        height = 150; //svgHej.attr("height");

    var x = d3.scaleLinear()
        .domain([min_year, max_year])
        .range([0, width])
        .clamp(true);

    var slider = sliderSvg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
                currentValue = d3.event.x;
                //console.log(Math.round(x.invert(currentValue)));
                update(Math.round(x.invert(currentValue))); 
            })
        );
        
    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 25 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) {return d });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 12);

    var label = slider.append("text")  
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(initYear)
        //.text(formatDate(min_year))
        .attr("transform", "translate(0," + (-25) + ")")


    function update(sliderYear) {
        //var sliderYear = document.getElementById("year").value;
        handle.attr("cx", x(sliderYear));

        label
            .attr("x", x(sliderYear))
            .text(sliderYear);
            
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

