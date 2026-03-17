// ----------------------
// WeatherWaypoints with OpenWeatherMap API
// ----------------------
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- Replace with your key from OpenWeatherMap
let map;

// ----------------------
// Weather icons
// ----------------------
const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Snow: "❄️"
};

// ----------------------
// City list (sample; extend to 200+ US + 50 global hubs)
// ----------------------
const cities = [
  {name:"New York, USA",lat:40.7128,lng:-74.0060},{name:"Los Angeles, USA",lat:34.0522,lng:-118.2437},
  {name:"Chicago, USA",lat:41.8781,lng:-87.6298},{name:"Atlanta, USA",lat:33.7490,lng:-84.3880},
  {name:"Dallas, USA",lat:32.7767,lng:-96.7970},{name:"Las Vegas, USA",lat:36.1699,lng:-115.1398},
  {name:"London, UK",lat:51.5074,lng:-0.1278},{name:"Paris, France",lat:48.8566,lng:2.3522},
  {name:"Tokyo, Japan",lat:35.6762,lng:139.6503},{name:"Dubai, UAE",lat:25.2048,lng:55.2708}
];

// ----------------------
// Initialize Leaflet map
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
      fetchWeather(city.name);
      map.setView([city.lat,city.lng],6);
    });
  });
}

function getRandomColor(){
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// ----------------------
// Find closest city
// ----------------------
function findClosestCity(inputCity){
  inputCity = inputCity.toLowerCase().trim();
  let exact = cities.find(c=>c.name.toLowerCase().includes(inputCity));
  if(exact) return exact;
  return cities.find(c=>c.name.toLowerCase().startsWith(inputCity)) || cities[0];
}

// ----------------------
// Fetch real weather data from OpenWeatherMap
// ----------------------
async function fetchWeather(cityName){
  const cityObj = findClosestCity(cityName);
  if(!cityObj){ alert("City not found."); return; }
  map.setView([cityObj.lat,cityObj.lng],6);

  try{
    const cleanedCity = cityObj.name.split(',')[0].trim();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanedCity)}&appid=${API_KEY}&units=imperial`);
    const data = await res.json();
    if(data.cod !== 200) throw new Error(data.message);

    const icon = weatherIcons[data.weather[0].main] || weatherIcons['Clear'];
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p style="font-size:2em;">${icon}</p>
      <p>Temperature: ${data.main.temp.toFixed(1)} °F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>${data.weather[0].description}</p>
    `;
    weatherDiv.classList.remove('hidden');
    weatherDiv.scrollIntoView({behavior:'smooth'});
  }catch(err){
    alert("Failed to fetch weather data: " + err.message);
  }
}

// ----------------------
// Event listener
// ----------------------
document.getElementById('fetchWeatherBtn').addEventListener('click',()=>{
  const city = document.getElementById('cityInput').value;
  if(city) fetchWeather(city);
});

// ----------------------
window.onload = initMap;
