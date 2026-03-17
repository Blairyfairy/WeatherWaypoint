const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // replace with your OpenWeatherMap key
let map;

// Initialize map
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4);

  // OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = [
    { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445 },
    { name: "Golden Gate Bridge", lat: 37.8199, lng: -122.4783 },
    { name: "Disney World", lat: 28.3852, lng: -81.5639 }
  ];

  locations.forEach(loc => {
    const marker = L.circleMarker([loc.lat, loc.lng], {
      radius: 10,
      color: '#fff',
      fillColor: getRandomColor(),
      fillOpacity: 1,
      weight: 2
    }).addTo(map);

    marker.on('click', () => fetchWeather(loc.name));
  });
}

// Random pastel marker colors
function getRandomColor() {
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fetch weather and display
async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`);
    const data = await response.json();
    if(data.cod !== 200) throw new Error("City not found");

    const iconSVG = weatherIcons[data.weather[0].main] || weatherIcons['Clear'];
    const weatherDiv = document.getElementById('weatherInfo');
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      ${iconSVG}
      <p>Temperature: ${data.main.temp} °F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>${data.weather[0].description}</p>
    `;
    weatherDiv.classList.remove('hidden');
    weatherDiv.scrollIntoView({ behavior: 'smooth' });

  } catch(err) {
    alert(err.message);
  }
}

// Event listener for city input
document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if(city) fetchWeather(city);
});

window.onload = initMap;
