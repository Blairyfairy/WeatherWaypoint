// ----------------------
// WeatherWaypoints - GitHub Pages offline demo
// ----------------------
let map;

// ----------------------
// Simulated weather icons & data
// ----------------------
const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Snow: "❄️"
};

// Simulated weather values for each city
function getSimulatedWeather(cityName){
  const types = ["Clear","Clouds","Rain","Snow"];
  const temp = Math.floor(Math.random()*60 + 30); // 30-90°F
  const humidity = Math.floor(Math.random()*50 + 30); // 30-80%
  const type = types[Math.floor(Math.random()*types.length)];
  return {type,temp,humidity};
}

// ----------------------
// Cities array (250+ offline ready)
// ----------------------
const cities = [
  {name:"New York, USA",lat:40.7128,lng:-74.0060},{name:"Los Angeles, USA",lat:34.0522,lng:-118.2437},
  {name:"Chicago, USA",lat:41.8781,lng:-87.6298},{name:"Atlanta, USA",lat:33.7490,lng:-84.3880},
  {name:"Dallas, USA",lat:32.7767,lng:-96.7970},{name:"Las Vegas, USA",lat:36.1699,lng:-115.1398},
  {name:"Miami, USA",lat:25.7617,lng:-80.1918},{name:"Seattle, USA",lat:47.6062,lng:-122.3321},
  {name:"London, UK",lat:51.5074,lng:-0.1278},{name:"Paris, France",lat:48.8566,lng:2.3522},
  {name:"Tokyo, Japan",lat:35.6762,lng:139.6503},{name:"Dubai, UAE",lat:25.2048,lng:55.2708}
  // ... extend to 250+ cities
];

// ----------------------
// Map initialization
// ----------------------
function initMap(){
  map = L.map('map').setView([20,0],2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  cities.forEach(city=>{
    const marker = L.circleMarker([city.lat,city.lng],{
      radius:6, color:'#fff', fillColor:getRandomColor(), fillOpacity:1, weight:2
    }).addTo(map);

    marker.on('click',()=>{
      showWeather(city.name);
      map.setView([city.lat,city.lng],6);
    });
  });
}

// ----------------------
function getRandomColor(){
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// ----------------------
// Closest city logic
// ----------------------
function findClosestCity(inputCity){
  inputCity = inputCity.toLowerCase().trim();
  let exact = cities.find(c=>c.name.toLowerCase().includes(inputCity));
  if(exact) return exact;
  return cities.find(c=>c.name.toLowerCase().startsWith(inputCity)) || cities[0];
}

// ----------------------
// Show weather in info box
// ----------------------
function showWeather(cityName){
  const cityObj = findClosestCity(cityName);
  if(!cityObj){ alert("City not found."); return; }
  map.setView([cityObj.lat,cityObj.lng],6);

  const weather = getSimulatedWeather(cityObj.name);
  const weatherDiv = document.getElementById('weatherInfo');
  weatherDiv.innerHTML = `
    <h2>Weather in ${cityObj.name}</h2>
    <p style="font-size:2em;">${weatherIcons[weather.type]}</p>
    <p>Temperature: ${weather.temp} °F</p>
    <p>Humidity: ${weather.humidity}%</p>
    <p>${weather.type}</p>
  `;
  weatherDiv.classList.remove('hidden');
  weatherDiv.scrollIntoView({behavior:'smooth'});
}

// ----------------------
// Event listener
// ----------------------
document.getElementById('fetchWeatherBtn').addEventListener('click',()=>{
  const city = document.getElementById('cityInput').value;
  if(city) showWeather(city);
});

// ----------------------
// Initialize
// ----------------------
window.onload = initMap;
