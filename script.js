var cities = [];
//need to get a handle on all the elements i need
var forecastContainerEl = document.querySelector("#fiveday");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
var weatherEl=document.querySelector("#nowWeather");
var citySearchEl = document.querySelector("#searched-city");
var cityPick=document.querySelector("#cityPick");
var cityEl=document.querySelector("#city");
var forecastTitle = document.querySelector("#forecast");

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityEl.value.trim();
    if(city){
        cityWeather(city);
        fiveDay(city);
        cities.unshift({city});
        cityEl.value = "";
    } 
    saveCity();
    pastCity(city);
}
//saving city seach to localStorage
var saveCity = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var cityWeather = function(city){
    //var apiKey = "844421298d794574c100e3409cee0499"
    var apiKey = "76302044741891289e7f2afcba047d5c"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
   weatherEl.textContent= "";  
   citySearchEl.textContent=searchCity;

   //should represent the date
   //var today = document.createElement("span")
   //today.textContent=dayjs();
   //$('#span').text(today.format('MMM DD, YYYY'));
   //citySearchEl.appendChild(today);
   //createing elements to hold temp, humidity, wind and append
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
   weatherEl.appendChild(temperatureEl);

   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"
   weatherEl.appendChild(humidityEl);

   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"
   weatherEl.appendChild(windSpeedEl);

   //createing image and appending
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchEl.appendChild(weatherIcon);
  
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
}

var fiveDay = function(city){
    var apiKey = "76302044741891289e7f2afcba047d5c"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //create date, image for top of forecast
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);
       
       //create temperature and humidity just like up top 
       //and appending into the cards of fiveDay
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);
       forecastContainerEl.appendChild(forecastEl);
    }

}

var pastCity = function(pastSearch){
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-3";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        cityWeather(city);
        fiveDay(city);
    }
}
//need event handlers
cityPick.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
