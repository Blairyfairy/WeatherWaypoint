// ----------------------
// Full script.js for WeatherWaypoints
// ----------------------

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap key
let map;

// ----------------------
// Weather SVG icons
// ----------------------
const weatherIcons = {
  Clear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50"><circle cx="32" cy="32" r="14" fill="#F5A623"/></svg>`,
  Clouds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50"><ellipse cx="32" cy="36" rx="20" ry="12" fill="#BDC3C7"/></svg>`,
  Rain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50">
          <ellipse cx="32" cy="30" rx="20" ry="12" fill="#BDC3C7"/>
          <line x1="22" y1="45" x2="22" y2="55" stroke="#3498DB" stroke-width="3"/>
          <line x1="32" y1="45" x2="32" y2="55" stroke="#3498DB" stroke-width="3"/>
          <line x1="42" y1="45" x2="42" y2="55" stroke="#3498DB" stroke-width="3"/>
        </svg>`,
  Snow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50">
          <ellipse cx="32" cy="30" rx="20" ry="12" fill="#BDC3C7"/>
          <text x="32" y="50" text-anchor="middle" fill="#3498DB" font-size="20">*</text>
        </svg>`
};

// ----------------------
// Cities List
// 200 US Cities + 50 Global Hubs
// ----------------------
const cities = [
  // US Cities (sample subset for brevity; include all 200 in final file)
  {name:"New York, USA",lat:40.7128,lng:-74.0060},{name:"Los Angeles, USA",lat:34.0522,lng:-118.2437},
  {name:"Chicago, USA",lat:41.8781,lng:-87.6298},{name:"Atlanta, USA",lat:33.7490,lng:-84.3880},
  {name:"Dallas, USA",lat:32.7767,lng:-96.7970},{name:"Miami, USA",lat:25.7617,lng:-80.1918},
  {name:"Seattle, USA",lat:47.6062,lng:-122.3321},{name:"Denver, USA",lat:39.7392,lng:-104.9903},
  {name:"Las Vegas, USA",lat:36.1699,lng:-115.1398},{name:"San Francisco, USA",lat:37.7749,lng:-122.4194},
  {name:"Boston, USA",lat:42.3601,lng:-71.0589},{name:"Houston, USA",lat:29.7604,lng:-95.3698},
  {name:"Philadelphia, USA",lat:39.9526,lng:-75.1652},{name:"Phoenix, USA",lat:33.4484,lng:-112.0740},
  {name:"Orlando, USA",lat:28.5383,lng:-81.3792},{name:"Minneapolis, USA",lat:44.9778,lng:-93.2650},
  // ... add remaining US cities up to 200

  // Global Airport Hubs (50)
  {name:"London, UK",lat:51.5074,lng:-0.1278},{name:"Paris, France",lat:48.8566,lng:2.3522},
  {name:"Tokyo, Japan",lat:35.6762,lng:139.6503},{name:"Dubai, UAE",lat:25.2048,lng:55.2708},
  {name:"Singapore",lat:1.3521,lng:103.8198},{name:"Frankfurt, Germany",lat:50.1109,lng:8.6821},
  {name:"Amsterdam, Netherlands",lat:52.3676,lng:4.9041},{name:"Sydney, Australia",lat:-33.8688,lng:151.2093},
  {name:"Toronto, Canada",lat:43.6532,lng:-79.3832},{name:"Vancouver, Canada",lat:49.2827,lng:-123.1207},
  {name:"Hong Kong",lat:22.3193,lng:114.1694},{name:"Seoul, South Korea",lat:37.5665,lng:126.9780},
  {name:"Bangkok, Thailand",lat:13.7563,lng:100.5018},{name:"Beijing, China",lat:39.9042,lng:116.4074},
  {name:"Shanghai, China",lat:31.2304,lng:121.4737},{name:"Delhi, India",lat:28.7041,lng:77.1025},
  {name:"Mumbai, India",lat:19.0760,lng:72.8777},{name:"Doha, Qatar",lat:25.2854,lng:51.5310},
  {name:"Istanbul, Turkey",lat:41.0082,lng:28.9784},{name:"Moscow, Russia",lat:55.7558,lng:37.6173},
  {name:"Rome, Italy",lat:41.9028,lng:12.4964},{name:"Madrid, Spain",lat:40.4168,lng:-3.7038},
  {name:"São Paulo, Brazil",lat:-23.5505,lng:-46.6333},{name:"Rio de Janeiro, Brazil",lat:-22.9068,lng:-43.1729},
  {name:"Mexico City, Mexico",lat:19.4326,lng:-99.1332},{name:"Buenos Aires, Argentina",lat:-34.6037,lng:-58.3816},
  {name:"Cairo, Egypt",lat:30.0444,lng:31.2357},{name:"Tokyo Narita, Japan",lat:35.7719,lng:140.3929}
  // ... add remaining hubs up to 50
];

// ----------------------
// Map initialization
// ----------------------
function initMap() {
  map = L.map('map').setView([20,0],2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 6, color: '#fff', fillColor: getRandomColor(), fillOpacity:1, weight:2
    }).addTo(map);

    marker.on('click',()=>{
      fetchWeather(city.name);
      map.setView([city.lat, city.lng],6);
    });
  });
}

// ----------------------
// Utility functions
// ----------------------
function getRandomColor() {
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random()*colors.length)];
}

function distance(lat1,lng1,lat2,lng2){
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
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
// Weather fetch
// ----------------------
async function fetchWeather(cityName){
  const cityObj = findClosestCity(cityName);
  if(!cityObj){ alert("City not found in our list."); return; }
  map.setView([cityObj.lat, cityObj.lng],6);

  try{
    const cleanedCity = cityObj.name.split(',')[0].trim();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanedCity)}&appid=${API_KEY}&units=imperial`);
    const data = await res.json();
    if(data.cod !== 200) throw new Error(data.message);

    const iconSVG = weatherIcons[data.weather[0].main] || weatherIcons['Clear'];
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      ${iconSVG}
      <p>Temperature: ${data.main.temp.toFixed(1)} °F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>${data.weather[0].description}</p>
    `;
    weatherDiv.classList.remove('hidden');
    weatherDiv.scrollIntoView({ behavior:'smooth' });
  }catch(err){ alert("Weather data fetch failed."); }
}

// ----------------------
// Event Listeners
// ----------------------
document.getElementById('fetchWeatherBtn').addEventListener('click',()=>{
  const city = document.getElementById('cityInput').value;
  if(city) fetchWeather(city);
});

// ----------------------
// Initialize map on load
// ----------------------
window.onload = initMap;
