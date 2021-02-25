// Do something nice
const ls = "hej";

let k;

d3.csv('/data/temp_data.csv').then((data) => {
    let countryArr = data.map((item) => item.country_name).filter((value, index, self) => self.indexOf(value) === index)

    let a; 
    a = new chart(data, countryArr);
})