const OWM_APIKEY = 'f3e54b6efd01aa921c195a000c37c9e8';

// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import css custom styles
import "./style.css";
// import cities list from JSON file
import cities from './cities.json';

delete L.Icon.Default.prototype._getIconUrl;

// Fix icons url
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

// On start
$(document).ready(async function () {
  const map = addDivMap();
  await populateWeatherData(cities);
  addMarkers(cities, map);
});

/**
 * Adds div to body and renders Leaflet map
 * @return {Map} Leaflet Map Object
 */
function addDivMap() {
  const divMap = $('<div id="map"></div>');
  $('body').append(divMap);

  const map = L.map('map').setView([39.25, -48.16], 3);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  	attribution: '',
  }).addTo(map);

  return map;
}

/**
 * Populates cities array with fetched weather from API
 * @param  {Array} cities
 * @return {void}
 */
async function populateWeatherData(cities) {
  await Promise.all(cities.map(async (c) => {
    c.weather = await fetchWeatherData(c.name);
  }));
}

/**
 * Fetch weather data from OpenWeatherMap's API
 * @param  {String} cityName
 * @return {Object}          Weather data
 */
async function fetchWeatherData(cityName) {
  //return '23';
  const api_url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + OWM_APIKEY + '&units=metric&lang=es';
  const res = await $.ajax({
    url : api_url,
    method : 'GET'
  });
  return res;
}

/**
 * Add city markers to Leaflet map
 * @param {Array} cities
 * @param {Map} map    Leaflet Map Object
 */
function addMarkers(cities, map) {
  const markers = cities.map(city =>
  L.marker(city.coords)
    .addTo(map)
    .bindPopup(generatePopup(city)));
}

/**
 * Generates Popup content
 * @param  {Object} city City Object
 * @return {String}      HTML Content
 */
function generatePopup(city) {
  let html = '<div>';
  html += '<h2>' + city.name + '</h2>';
  html += '<h4>' + capitalizeFirstLetter(city.weather.weather[0].description) + '</h4>';
  html += '<div><b>Temperatura:</b> ' + city.weather.main.temp + '</div>';
  html += '<div><b>Max:</b> ' + city.weather.main.temp_max + '</div>';
  html += '<div><b>Min:</b> ' + city.weather.main.temp_min + '</div>';
  html += '<div><b>Presión:</b> ' + city.weather.main.pressure + '</div>';
  html += '<div><b>Humedad:</b> ' + city.weather.main.humidity + '</div>';
  html += '</div>';

  return html;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
