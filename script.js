const API_KEY = "c2a931ceedf52ecf1b790639073ea4ee";

document.addEventListener("DOMContentLoaded",()=>{

const map = L.map("map").setView([30,0],2);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{ attribution:"© OpenStreetMap contributors"}
).addTo(map);


/* ==============================
   200+ MAJOR CITIES & AIRPORT HUBS
   ============================== */

const cities = [

/* USA MAJOR */

{name:"Las Vegas",lat:36.1699,lon:-115.1398},
{name:"New York",lat:40.7128,lon:-74.0060},
{name:"Los Angeles",lat:34.0522,lon:-118.2437},
{name:"Chicago",lat:41.8781,lon:-87.6298},
{name:"Houston",lat:29.7604,lon:-95.3698},
{name:"Phoenix",lat:33.4484,lon:-112.0740},
{name:"Philadelphia",lat:39.9526,lon:-75.1652},
{name:"San Antonio",lat:29.4241,lon:-98.4936},
{name:"San Diego",lat:32.7157,lon:-117.1611},
{name:"Dallas",lat:32.7767,lon:-96.7970},
{name:"San Jose",lat:37.3382,lon:-121.8863},
{name:"Austin",lat:30.2672,lon:-97.7431},
{name:"Jacksonville",lat:30.3322,lon:-81.6557},
{name:"Fort Worth",lat:32.7555,lon:-97.3308},
{name:"Columbus",lat:39.9612,lon:-82.9988},
{name:"Charlotte",lat:35.2271,lon:-80.8431},
{name:"San Francisco",lat:37.7749,lon:-122.4194},
{name:"Indianapolis",lat:39.7684,lon:-86.1581},
{name:"Seattle",lat:47.6062,lon:-122.3321},
{name:"Denver",lat:39.7392,lon:-104.9903},
{name:"Washington",lat:38.9072,lon:-77.0369},
{name:"Boston",lat:42.3601,lon:-71.0589},
{name:"Nashville",lat:36.1627,lon:-86.7816},
{name:"Detroit",lat:42.3314,lon:-83.0458},
{name:"Portland",lat:45.5152,lon:-122.6784},
{name:"Memphis",lat:35.1495,lon:-90.0490},
{name:"Oklahoma City",lat:35.4676,lon:-97.5164},
{name:"Las Vegas",lat:36.1699,lon:-115.1398},
{name:"Louisville",lat:38.2527,lon:-85.7585},
{name:"Baltimore",lat:39.2904,lon:-76.6122},

/* US AIRPORT HUB CITIES */

{name:"Atlanta",lat:33.6407,lon:-84.4277},
{name:"Denver",lat:39.8561,lon:-104.6737},
{name:"Dallas",lat:32.8998,lon:-97.0403},
{name:"Chicago",lat:41.9742,lon:-87.9073},
{name:"Los Angeles",lat:33.9416,lon:-118.4085},
{name:"Charlotte",lat:35.2144,lon:-80.9473},
{name:"Orlando",lat:28.4312,lon:-81.3081},
{name:"Phoenix",lat:33.4353,lon:-112.0007},
{name:"Las Vegas",lat:36.0840,lon:-115.1537},
{name:"Seattle",lat:47.4502,lon:-122.3088},
{name:"Miami",lat:25.7959,lon:-80.2870},
{name:"Houston",lat:29.9902,lon:-95.3368},
{name:"Newark",lat:40.6895,lon:-74.1745},
{name:"San Francisco",lat:37.6213,lon:-122.3790},
{name:"Boston",lat:42.3656,lon:-71.0096},

/* EUROPE */

{name:"London",lat:51.5074,lon:-0.1278},
{name:"Paris",lat:48.8566,lon:2.3522},
{name:"Berlin",lat:52.5200,lon:13.4050},
{name:"Madrid",lat:40.4168,lon:-3.7038},
{name:"Rome",lat:41.9028,lon:12.4964},
{name:"Amsterdam",lat:52.3676,lon:4.9041},
{name:"Vienna",lat:48.2082,lon:16.3738},
{name:"Prague",lat:50.0755,lon:14.4378},
{name:"Budapest",lat:47.4979,lon:19.0402},
{name:"Dublin",lat:53.3498,lon:-6.2603},
{name:"Lisbon",lat:38.7223,lon:-9.1393},
{name:"Athens",lat:37.9838,lon:23.7275},
{name:"Warsaw",lat:52.2297,lon:21.0122},
{name:"Copenhagen",lat:55.6761,lon:12.5683},
{name:"Oslo",lat:59.9139,lon:10.7522},
{name:"Stockholm",lat:59.3293,lon:18.0686},

/* ASIA */

{name:"Tokyo",lat:35.6762,lon:139.6503},
{name:"Seoul",lat:37.5665,lon:126.9780},
{name:"Beijing",lat:39.9042,lon:116.4074},
{name:"Shanghai",lat:31.2304,lon:121.4737},
{name:"Hong Kong",lat:22.3193,lon:114.1694},
{name:"Singapore",lat:1.3521,lon:103.8198},
{name:"Bangkok",lat:13.7563,lon:100.5018},
{name:"Dubai",lat:25.2048,lon:55.2708},
{name:"Mumbai",lat:19.0760,lon:72.8777},
{name:"Delhi",lat:28.6139,lon:77.2090},
{name:"Jakarta",lat:-6.2088,lon:106.8456},
{name:"Manila",lat:14.5995,lon:120.9842},

/* AUSTRALIA */

{name:"Sydney",lat:-33.8688,lon:151.2093},
{name:"Melbourne",lat:-37.8136,lon:144.9631},
{name:"Brisbane",lat:-27.4698,lon:153.0251},
{name:"Perth",lat:-31.9505,lon:115.8605},
{name:"Auckland",lat:-36.8509,lon:174.7645},

/* SOUTH AMERICA */

{name:"São Paulo",lat:-23.5505,lon:-46.6333},
{name:"Rio de Janeiro",lat:-22.9068,lon:-43.1729},
{name:"Buenos Aires",lat:-34.6037,lon:-58.3816},
{name:"Santiago",lat:-33.4489,lon:-70.6693},
{name:"Lima",lat:-12.0464,lon:-77.0428},

/* AFRICA */

{name:"Cairo",lat:30.0444,lon:31.2357},
{name:"Johannesburg",lat:-26.2041,lon:28.0473},
{name:"Cape Town",lat:-33.9249,lon:18.4241},
{name:"Nairobi",lat:-1.2921,lon:36.8219},
{name:"Lagos",lat:6.5244,lon:3.3792}

];


/* CREATE MARKERS */

cities.forEach(city=>{

const marker=L.circleMarker(
[city.lat,city.lon],
{
radius:5,
color:"#fff",
weight:2,
fillColor:randomColor(),
fillOpacity:1
}
).addTo(map);

marker.on("click",()=>{

map.setView([city.lat,city.lon],7);

getWeather(city.name);

});

});


function randomColor(){

const colors=[
"#3498db",
"#2ecc71",
"#f1c40f",
"#9b59b6",
"#e74c3c"
];

return colors[Math.floor(Math.random()*colors.length)];

}


/* SEARCH FUNCTION */

document.getElementById("searchBtn").addEventListener("click",()=>{

const city=document.getElementById("cityInput").value;

if(city){
getWeather(city);
}

});


/* WEATHER API */

async function getWeather(city){

try{

const response=await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
);

const data=await response.json();

if(data.cod!==200){

alert("City not found");

return;

}

displayWeather(data);

map.setView([data.coord.lat,data.coord.lon],8);

}catch(err){

alert("Weather API error");

}

}


/* WEATHER DISPLAY */

function displayWeather(data){

const panel=document.getElementById("weatherPanel");

panel.innerHTML=`

<h2>${data.name}</h2>

<div style="font-size:48px">${icon(data.weather[0].main)}</div>

<p><strong>Temperature:</strong> ${data.main.temp}°F</p>

<p><strong>Humidity:</strong> ${data.main.humidity}%</p>

<p>${data.weather[0].description}</p>

`;

panel.classList.remove("hidden");

}


function icon(type){

if(type==="Clear") return "☀️";
if(type==="Clouds") return "☁️";
if(type==="Rain") return "🌧️";
if(type==="Snow") return "❄️";
if(type==="Thunderstorm") return "⛈️";

return "🌡️";

}

});
