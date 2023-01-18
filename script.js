var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#city2search');
var currentCity = document.querySelector('#displayedCity');
var currentWeatherImage = document.querySelector('#weatherImage');
var currentTemperature = document.querySelector('#temperature');
var currentWind = document.querySelector('#wind-velocity');
var currentHumidity = document.querySelector('#humidity')
var historic = document.querySelector('#searched-history')
var forecastEl = document.querySelector('#forecast-items');
var historial = [];

function forecast(lat, lon){
  const forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=c329491a89f4a5039c2d007289d8b789';
  fetch(forecastURL) 
    .then(function (response) {
      return response.json(); 
    })
    .then(function (data) {
      displayForecastCard(data);
    });   
}

function displayForecastCard(data){
  forecastEl.innerHTML = '';
  var todayDate = dayjs.unix(data.list[0].dt);
  var currentDay = document.getElementById('display-currentDay')
  currentDay.innerHTML = todayDate.format('MMMM D, YYYY');
  var currentTemp = (((data.list[0].main.temp) - 273.15) * (1.8)) + 32;
  currentWeatherImage.innerHTML = '<img src=http://openweathermap.org/img/w/'+ data.list[0].weather[0].icon +'.png>';



  currentTemperature.innerHTML = "Temp: " + currentTemp.toFixed() + " °F";
  currentHumidity.innerHTML = "Humidity: " + data.list[0].main.humidity + " %";
  currentWind.innerHTML = "Wind: " + data.list[0].wind.speed + " MPH";
  
  for (var i=3; i<36; i+=8){
    var forecastCard = document.createElement('div');
    var forecastDate = dayjs.unix(data.list[i].dt);
    var tempoConversion = (((data.list[i].main.temp) - 273.15) * (1.8)) + 32;
    
    forecastCard.innerHTML = '<p> Date: '+ forecastDate.format('MMMM D, YYYY') +'</p>\
    <i id="weatherImage">    <img src="http://openweathermap.org/img/w/'+ data.list[i].weather[0].icon +'.png"  </i>\
    <p>Temp: '+ tempoConversion.toFixed() +' °F </p>\
    <p>Wind: '+ data.list[i].wind.speed +' MPH</p>\
    <p">Humidity: '+ data.list[i].main.humidity +' %</p>';

    forecastEl.appendChild(forecastCard);
  } 
}

function geolocation(City){
  currentCity.textContent = City;
  const geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+City+'&limit=1&units=imperial&appid=ea0763230740eaf545ca4348dc8ed6be';
  fetch(geocodingURL) 
    .then(function (response) {
      return response.json(); 
    })
    .then(function (data) {
      forecast(data[0].lat, data[0].lon);
    });
}

function displaySearchedCities (item4History){
  historic.innerHTML = "";

  for (var i=0; i<item4History.length;i++){
    var displayItem = document.createElement('li');
    displayItem.textContent = item4History[i];
    historic.appendChild(displayItem);
    displayItem.addEventListener('click', (displayItem)=>{
      geolocation((displayItem.srcElement.innerText));
    })
  }
}

if (localStorage.getItem('Historial')){
  historial = localStorage.getItem('Historial').split(',')
  displaySearchedCities(historial);
}

userFormEl.addEventListener('submit', ()=>{
  event.preventDefault();
  geolocation(nameInputEl.value);
  // displaySearchedCities(nameInputEl.value);
  historial.push(nameInputEl.value);
  displaySearchedCities(historial);
  localStorage.setItem('Historial', historial);
})
