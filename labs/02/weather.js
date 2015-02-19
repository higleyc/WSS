var firstLoadDone = false;
function init() {
    // Attempt to grab the location from the browser
    if (navigator.geolocation) {
        setInterval(function() {
            navigator.geolocation.getCurrentPosition(loadWeather);
        }, 60000);
        navigator.geolocation.getCurrentPosition(loadWeather);
    }
    else {
        alert("Location services are not available");
    }
}

function loadWeather(location) {
    // Current data
    var apiURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + location.coords.latitude + "&lon=" + location.coords.longitude;  
    $.ajax({
        url: apiURL,
        success: function(weatherData) {
            // City
            $("#city").html(weatherData.name);
            
            // Current temp
            var temp = formatNumber(weatherData.main.temp);
            $("#temp").html(temp);
            
            // Winds
            $("#winds").html(weatherData.wind.speed);
            
            // Humidity
            $("#humidity").html(weatherData.main.humidity);
            
            // Conditions
            $("#conditions").html(weatherData.weather[0].description);
            
            // Image
            setIcon(weatherData.weather[0], $("#conditionsimage"));
            loadDone();
        }
    });
    
    // Forecast data
    apiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=5&units=imperial&lat=" + location.coords.latitude + "&lon=" + location.coords.longitude;
    $.ajax({
        url: apiURL,
        success: function(weatherData) {
            var today = weatherData.list[0];
            $("#high").html(formatNumber(today.temp.max));
            $("#low").html(formatNumber(today.temp.min));
            loadDone();
        }
    });
}

function formatNumber(num) {
    return num.toString().match(/[^.]*/);
}

function loadDone() {
    if (firstLoadDone) {
        $("#weatherbox").css("opacity", 1);
    }
    else {
        firstLoadDone = true;
    }
}

function setIcon(condition, element) {
    var imgURL;
    if (condition.id >= 200 && condition.id <= 232) {
        // Thunderstorm
        imgURL = "thunderstorm.png";
    }
    else if ((condition.id >= 300 && condition.id <= 321) || (condition.id >= 500 && condition.id <= 531)) {
        // Rain/drizzle
        imgURL = "rain.png";
    }
    else if (condition.id >= 600 && condition.id <= 622) {
        // Snow
        imgURL = "snow.png";
    }
    else if(condition.id == 800) {
        // Clear
        imgURL = "clear.png";
    }
    else if(condition.id >= 801 && condition.id <= 804) {
        // Partly cloudy 
        imgURL = "cloudy.png";
    }
    else {
        imgURL = "http://openweathermap.org/img/w/" + condition.icon + ".png";
    }
    
    element.attr("src", imgURL);
}