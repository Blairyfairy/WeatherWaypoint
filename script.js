// ----------------------
// WeatherWaypoint - Enhanced Script
// ----------------------

const API_KEY = 'c2a931ceedf52ecf1b790639073ea4ee'; // Your OpenWeatherMap API Key
let map;
let markers = [];
let tempUnit = 'imperial'; // Default °F
let lastWeatherData = {}; // Store last fetched data for hover popups

// Weather SVG icons
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
          </svg>`,
};

// ----------------------
// Sample Cities (Add hundreds for real deployment)
const cities = [
    { name: "New York, USA", lat: 40.7128, lng: -74.006 },
    { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
    { name: "Chicago, USA", lat: 41.8781, lng: -87.6298 },
    { name: "Las Vegas, USA", lat: 36.1699, lng: -115.1398 },
    { name: "London, UK", lat: 51.5074, lng: -0.1278 },
    { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
    { name: "Atlanta, USA", lat: 33.749, lng: -84.388 },
    { name: "Dallas, USA", lat: 32.7767, lng: -96.797 },
];

// ----------------------
// Initialize Map
function initMap() {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers with animation
    cities.forEach((city, i) => {
        setTimeout(() => {
            const marker = L.circleMarker([city.lat, city.lng], {
                radius: 8,
                color: '#fff',
                fillColor: getRandomColor(),
                fillOpacity: 1,
                weight: 2
            }).addTo(map);

            // Store marker for hover events
            markers.push(marker);

            marker.on('click', () => fetchWeather(city.name));
            marker.on('mouseover', () => showPopup(marker, city));
            marker.on('mouseout', () => marker.closePopup());

        }, i * 100); // staggered drop animation
    });
}

// ----------------------
// Marker hover popup
function showPopup(marker, city) {
    const key = city.name;
    const temp = lastWeatherData[key] ? `${lastWeatherData[key].temp.toFixed(1)}°${tempUnit==='imperial'?'F':'C'}` : 'Click to fetch';
    marker.bindPopup(`<b>${city.name}</b><br>${temp}`).openPopup();
}

// ----------------------
// Fetch weather data
async function fetchWeather(cityName) {
    const cityObj = findClosestCity(cityName);
    if (!cityObj) { alert("City not found in our list."); return; }

    map.flyTo([cityObj.lat, cityObj.lng], 6, {duration:1.5});

    try {
        const cleanedCity = cityObj.name.split(',')[0].trim();
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanedCity)}&appid=${API_KEY}&units=${tempUnit}`);
        const data = await res.json();
        if (data.cod !== 200) throw new Error(data.message);

        lastWeatherData[cityObj.name] = { temp: data.main.temp };

        const iconSVG = weatherIcons[data.weather[0].main] || weatherIcons['Clear'];
        const weatherDiv = document.getElementById('weatherInfo');
        weatherDiv.innerHTML = `
            <h2>Weather in ${data.name}</h2>
            ${iconSVG}
            <p>Temperature: ${data.main.temp.toFixed(1)} °${tempUnit==='imperial'?'F':'C'}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>${data.weather[0].description}</p>
            <button id="toggleUnitBtn">Toggle °F/°C</button>
        `;
        weatherDiv.classList.add('show');

        document.getElementById('toggleUnitBtn').addEventListener('click', () => {
            tempUnit = tempUnit==='imperial' ? 'metric' : 'imperial';
            fetchWeather(cityObj.name);
        });

        weatherDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert("Weather data fetch failed.");
    }
}

// ----------------------
// Random marker color
function getRandomColor() {
    const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
    return colors[Math.floor(Math.random()*colors.length)];
}

// ----------------------
// Find closest city
function distance(lat1,lng1,lat2,lng2) {
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLng = (lng2-lng1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c;
}
function findClosestCity(inputCity) {
    inputCity = inputCity.toLowerCase().trim();
    let exact = cities.find(c => c.name.toLowerCase().includes(inputCity));
    if(exact) return exact;
    return cities.find(c => c.name.toLowerCase().startsWith(inputCity)) || cities[0];
}

// ----------------------
// Event listeners
document.getElementById('fetchWeatherBtn').addEventListener('click', ()=>{
    const city = document.getElementById('cityInput').value;
    if(city) fetchWeather(city);
});
document.getElementById('cityInput').addEventListener('keypress', (e)=>{
    if(e.key === 'Enter') document.getElementById('fetchWeatherBtn').click();
});

// ----------------------
// Initialize
window.onload = initMap;
