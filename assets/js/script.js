var submit = document.querySelector('#submit');
var cityInput = document.querySelector('#location');

var APIKey = "521a342184e2b2dbb79fddea33585e9f";

// TODO: get unambiguous results with city ID (not required)

// use OpenWeather API to retrieve weather data
function getApi(event) {
    event.preventDefault();

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput.value + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

submit.addEventListener('click', getApi);



// use localstorage to store persistant data


// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city