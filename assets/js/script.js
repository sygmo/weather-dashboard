var submit = document.querySelector('#submit');
var cityInput = document.querySelector('#location');
var cityNameDate = document.querySelector('#city-name');
var todayTemp = document.querySelector('#today-temp');
var todayWind = document.querySelector('#today-wind');
var todayHumidity = document.querySelector('#today-humidity');
var UVIndex = document.querySelector('#uv-index');
var searchHistoryEl = document.querySelector('#search-history');
var forecastEl = document.querySelector('#forecast');

var APIKey = "521a342184e2b2dbb79fddea33585e9f";

var searchHistory = JSON.parse(localStorage.getItem("history")) ?? [];

// call on launch
displaySearchHistory();

// TODO: set default current weather to most recent search

function displaySearchHistory() {
    // remove existing button elements
    while (searchHistoryEl.lastChild) {
        searchHistoryEl.removeChild(searchHistoryEl.lastChild);
    }
    // display history from newest to oldest
    for (var i = searchHistory.length - 1; i >= 0; i--) {
        console.log(searchHistory[i]);
        var historyItem = document.createElement('button');
        historyItem.className = 'btn btn-secondary';
        historyItem.textContent = searchHistory[i];
        searchHistoryEl.append(historyItem);
    }
}

// use OpenWeather API to retrieve location data
function getApi(event) {
    event.preventDefault();

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput.value + "&units=imperial&appid=" + APIKey;

    // clear input field
    cityInput.value = ''

    fetch(queryURL)
        .then(function (response) {
            // handle if empty or incorrect city name is submitted
            if(response.status === 400 || response.status === 404) {
                throw new Error(`HTTP error! status: ${response.status}`)
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);

            // store search history in localstorage
            // prevent duplicates
            if (!searchHistory.includes(data.name)) {
                searchHistory.push(data.name);
                // remove oldest search if history is longer than 8
                if (searchHistory.length > 8) {
                    searchHistory.shift();
                }
                localStorage.setItem("history", JSON.stringify(searchHistory));
                // update history on page
                displaySearchHistory();
            }

            getOneCallApi(data.coord.lat, data.coord.lon, data.name);
        })
        .catch(e => {
            console.log("Problem with the fetch operation: " + e.message);
        })
}

// API call when clicking on search history buttons
function getApiFromHistory(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            getOneCallApi(data.coord.lat, data.coord.lon, cityName);
        })
}

// use One Call API to get current weather and 5-day forecast data
function getOneCallApi(lat, lon, cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            cityNameDate.textContent = cityName + " (" + moment.unix(data.current.dt).format("M/D/YYYY") + ") ";

            // append weather icon
            var weatherImage = document.createElement('img');
            weatherImage.setAttribute('src', "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
            cityNameDate.append(weatherImage);

            todayTemp.textContent = data.current.temp;
            todayWind.textContent = data.current.wind_speed;
            todayHumidity.textContent = data.current.humidity;

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

            // remove previous 5-day forecast
            while (forecastEl.lastChild) {
                forecastEl.removeChild(forecastEl.lastChild);
            }

            // generate 5-day forecast
            var dailyForecast = data.daily;
            for (var i = 0; i < 5; i++) {
                var dayEl = document.createElement('div');

                var dateEl = document.createElement('h4');
                dateEl.textContent = moment.unix(dailyForecast[i].dt).format("M/D/YYYY");
                dayEl.append(dateEl);

                var weatherIcon = document.createElement('img');
                weatherIcon.setAttribute('src', "http://openweathermap.org/img/wn/" + dailyForecast[i].weather[0].icon + "@2x.png");
                dayEl.append(weatherIcon);

                var tempP = document.createElement('p');
                var windP = document.createElement('p');
                var humidityP = document.createElement('p');
                tempP.textContent = "Temp: " + dailyForecast[i].temp.day + "°F";
                windP.textContent = "Wind: " + dailyForecast[i].wind_speed + " MPH";
                humidityP.textContent = "Humidity: " + dailyForecast[i].humidity + "%";
                dayEl.append(tempP, windP, humidityP);

                forecastEl.append(dayEl);
            }


        })
}

submit.addEventListener('click', getApi);

searchHistoryEl.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn')) {
        console.log("Clicked " + event.target.textContent)
        getApiFromHistory(event.target.textContent);
    }
})




// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city