var submit = document.querySelector('#submit');
var cityInput = document.querySelector('#location');
var cityNameDate = document.querySelector('#city-name');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.querySelector('#today-wind');
var todayHumidity = document.querySelector('#today-humidity');
var UVIndex = document.querySelector('#uv-index');

var APIKey = "521a342184e2b2dbb79fddea33585e9f";

// TODO: get unambiguous results with city ID (not required)

// use OpenWeather API to retrieve weather data
function getApi(event) {
    event.preventDefault();

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput.value + "&units=imperial&appid=" + APIKey;

    // TODO: validation - return error message if invalid city name
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            cityNameDate.textContent = data.name + " (" + moment.unix(data.dt).format("M/D/YYYY") + ") ";
            // append weather icon
            var weatherImage = document.createElement('img');
            weatherImage.setAttribute('src', "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            cityNameDate.append(weatherImage);
            todayTemp.textContent = data.main.temp;
            todayWind.textContent = data.wind.speed;
            todayHumidity.textContent = data.main.humidity;

            getOneCallApi(data.coord.lat, data.coord.lon);
        })
}

// use One Call API to get UVI and 5-day forecast data
function getOneCallApi(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var uvi = data.current.uvi;
            UVIndex.textContent = uvi;
            // change UVI color based on whether conditions are favorable, moderate, or severe
            if (uvi < 3) {
                UVIndex.className = 'bg-success text-white';
            } else if (uvi >= 3 && uvi < 5) {
                UVIndex.className = 'bg-warning text-black';
            } else {
                UVIndex.className = 'bg-danger text-white';
            }
        })
}

submit.addEventListener('click', getApi);



// use localstorage to store persistant data


// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city