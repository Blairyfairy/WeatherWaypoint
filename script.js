const API_KEY = "c2a931ceedf52ecf1b790639073ea4ee";

let map;

// Example city markers
const cities = [
{ name:"New York", lat:40.7128, lon:-74.0060 },
{ name:"Los Angeles", lat:34.0522, lon:-118.2437 },
{ name:"Chicago", lat:41.8781, lon:-87.6298 },
{ name:"Las Vegas", lat:36.1699, lon:-115.1398 },
{ name:"Atlanta", lat:33.7490, lon:-84.3880 },
{ name:"Dallas", lat:32.7767, lon:-96.7970 },
{ name:"London", lat:51.5074, lon:-0.1278 },
{ name:"Paris", lat:48.8566, lon:2.3522 },
{ name:"Tokyo", lat:35.6762, lon:139.6503 }
];

// Initialize map
function initMap(){

map = L.map("map").setView([20,0],2);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:"© OpenStreetMap contributors"
}
).addTo(map);

cities.forEach(city=>{

let marker = L.circleMarker(
[city.lat, city.lon],
{
radius:6,
color:"#fff",
fillColor:getColor(),
fillOpacity:1,
weight:2
}
).addTo(map);

marker.on("click",()=>{
getWeather(city.name);
map.setView([city.lat, city.lon],6);
});

});

}

// random marker colors
function getColor(){

const colors=[
"#FF6B6B",
"#4ECDC4",
"#FFD93D",
"#6A4C93",
"#F5A623"
];

return colors[Math.floor(Math.random()*colors.length)];

}

// Weather API call
async function getWeather(city){

try{

let response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
);

let data = await response.json();

if(data.cod !== 200){
alert("City not found");
return;
}

displayWeather(data);

}catch(err){

alert("Error fetching weather");

}

}

// Show weather
function displayWeather(data){

const weatherBox = document.getElementById("weatherInfo");

weatherBox.innerHTML = `
<h2>${data.name}</h2>
<p style="font-size:2em">${getIcon(data.weather[0].main)}</p>
<p><b>Temperature:</b> ${data.main.temp} °F</p>
<p><b>Humidity:</b> ${data.main.humidity}%</p>
<p>${data.weather[0].description}</p>
`;

weatherBox.classList.remove("hidden");

}

// simple icon display
function getIcon(type){

if(type==="Clear") return "☀️";
if(type==="Clouds") return "☁️";
if(type==="Rain") return "🌧️";
if(type==="Snow") return "❄️";

return "🌡️";

}

// search input
document.getElementById("fetchWeatherBtn").addEventListener("click",()=>{

let city=document.getElementById("cityInput").value;

if(city){
getWeather(city);
}

});

// start map
window.onload = initMap;
