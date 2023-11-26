document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var city = document.getElementById("city-input").value.trim();

    if (city !== "") {
        getWeather(city);
    }
});

function getWeather(city) {
    // Use the OpenWeatherMap API to get weather data
    var apiKey = "d99135111cf34bedbcd543c21a9a287c"; // Replace with your actual API key
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch the data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            updateForecast(data);
            addToSearchHistory(city);
        })
        .catch(error => console.error("Error fetching data:", error));
}

function updateCurrentWeather(data) {
    // Update the current-weather section with the provided data
    var currentWeatherElement = document.getElementById("current-weather");
    var temperatureFahrenheit = convertKelvinToFahrenheit(data.list[0].main.temp);
    var weatherIcon = data.list[0].weather[0].icon;

    currentWeatherElement.innerHTML = `<h2>${data.city.name}</h2>
                                       <p>${data.list[0].dt_txt}</p>
                                       <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                                       <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
                                       <p>Humidity: ${data.list[0].main.humidity}%</p>
                                       <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>`;
}

    

function updateForecast(data) {
    // Update the forecast section with the provided data
    var forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = ""; 

// Filter data to get one data point per day
var dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

// Display the forecast for the next 5 days
for (var i = 0; i < dailyData.length; i++) {
    var date = new Date(dailyData[i].dt * 1000);
    var temperatureFahrenheit = convertKelvinToFahrenheit(dailyData[i].main.temp);
    var weatherIcon = dailyData[i].weather[0].icon;

    forecastElement.innerHTML += `<div class="daily-forecast">
                                    <h3>${date.toLocaleDateString()}</h3>
                                    <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                                    <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
                                    <p>Humidity: ${dailyData[i].main.humidity}%</p>
                                    <p>Wind Speed: ${dailyData[i].wind.speed} m/s</p>
                                 </div>`;
    }
}

function convertKelvinToFahrenheit(kelvinTemperature) {
    return (kelvinTemperature - 273.15) * (9 / 5) + 32;
}

function addToSearchHistory(city) {
    // Add the city to the search history
    var searchHistoryElement = document.getElementById("search-history");
    searchHistoryElement.innerHTML += `<div class="history-item" onclick="handleHistoryClick('${city}')">${city}</div>`;
}

function handleHistoryClick(city) {
    // Handle clicks on search history items
    getWeather(city);
}
