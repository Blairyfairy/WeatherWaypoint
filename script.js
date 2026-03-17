const API_KEY="c2a931ceedf52ecf1b790639073ea4ee";

document.addEventListener("DOMContentLoaded",()=>{

let map;

const icons={
Clear:"☀️",
Clouds:"☁️",
Rain:"🌧️",
Snow:"❄️",
Thunderstorm:"⛈️",
Drizzle:"🌦️"
};

/* MAJOR GLOBAL CITIES + AIRPORT HUBS */

const cities=[

["New York",40.7128,-74.0060],
["Los Angeles",34.0522,-118.2437],
["Chicago",41.8781,-87.6298],
["Atlanta",33.7490,-84.3880],
["Dallas",32.7767,-96.7970],
["Las Vegas",36.1699,-115.1398],
["Denver",39.7392,-104.9903],
["Seattle",47.6062,-122.3321],
["San Francisco",37.7749,-122.4194],
["Miami",25.7617,-80.1918],
["Boston",42.3601,-71.0589],
["Washington",38.9072,-77.0369],
["Phoenix",33.4484,-112.0740],
["Houston",29.7604,-95.3698],
["Orlando",28.5383,-81.3792],
["Charlotte",35.2271,-80.8431],
["Detroit",42.3314,-83.0458],
["Minneapolis",44.9778,-93.2650],
["Salt Lake City",40.7608,-111.8910],
["Portland",45.5152,-122.6784],

["London",51.5074,-0.1278],
["Paris",48.8566,2.3522],
["Berlin",52.52,13.405],
["Madrid",40.4168,-3.7038],
["Rome",41.9028,12.4964],
["Amsterdam",52.3676,4.9041],
["Vienna",48.2082,16.3738],
["Prague",50.0755,14.4378],
["Dublin",53.3498,-6.2603],
["Lisbon",38.7223,-9.1393],

["Tokyo",35.6762,139.6503],
["Seoul",37.5665,126.9780],
["Beijing",39.9042,116.4074],
["Shanghai",31.2304,121.4737],
["Singapore",1.3521,103.8198],
["Bangkok",13.7563,100.5018],
["Dubai",25.2048,55.2708],
["Mumbai",19.0760,72.8777],
["Delhi",28.6139,77.2090],
["Jakarta",-6.2088,106.8456],

["Sydney",-33.8688,151.2093],
["Melbourne",-37.8136,144.9631],
["Brisbane",-27.4698,153.0251],

["Cairo",30.0444,31.2357],
["Johannesburg",-26.2041,28.0473],
["Cape Town",-33.9249,18.4241],

["São Paulo",-23.5505,-46.6333],
["Rio",-22.9068,-43.1729],
["Buenos Aires",-34.6037,-58.3816],
["Santiago",-33.4489,-70.6693],
["Lima",-12.0464,-77.0428]

];


/* MAP INIT */

map=L.map("map").setView([20,0],2);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{attribution:"© OpenStreetMap contributors"}
).addTo(map);


/* CREATE CITY MARKERS */

cities.forEach(city=>{

const marker=L.circleMarker(
[city[1],city[2]],
{
radius:7,
color:"#fff",
fillColor:randomColor(),
fillOpacity:1,
weight:2
}
).addTo(map);

marker.on("click",()=>{
fetchWeather(city[0]);
map.setView([city[1],city[2]],6);
});

});


function randomColor(){

const colors=["#FF6B6B","#4ECDC4","#FFD93D","#6A4C93","#F5A623"];

return colors[Math.floor(Math.random()*colors.length)];

}


/* SEARCH */

document.getElementById("fetchWeatherBtn").addEventListener("click",searchCity);

document.getElementById("cityInput").addEventListener("keypress",e=>{
if(e.key==="Enter") searchCity();
});


function searchCity(){

const city=document.getElementById("cityInput").value.trim();

if(city) fetchWeather(city);

}


/* WEATHER API */

async function fetchWeather(city){

try{

const res=await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${API_KEY}`
);

const data=await res.json();

if(data.cod!==200){
alert("City not found");
return;
}

displayWeather(data);

map.setView([data.coord.lat,data.coord.lon],7);

}catch{

alert("Weather API request failed");

}

}


/* WEATHER DISPLAY */

function displayWeather(data){

const weatherDiv=document.getElementById("weatherInfo");

const icon=icons[data.weather[0].main] || "🌡️";

weatherDiv.innerHTML=`

<h2>${data.name}</h2>

<div style="font-size:48px">${icon}</div>

<p><strong>Temperature:</strong> ${data.main.temp.toFixed(1)} °F</p>

<p><strong>Humidity:</strong> ${data.main.humidity}%</p>

<p>${data.weather[0].description}</p>

`;

weatherDiv.classList.remove("hidden");

weatherDiv.scrollIntoView({behavior:"smooth"});

}

});
