const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap key
let map;

// Major global city airport hubs
const cities = [
  { name: "New York, USA", lat: 40.7128, lng: -74.0060 },
  { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago, USA", lat: 41.8781, lng: -87.6298 },
  { name: "Atlanta, USA", lat: 33.7490, lng: -84.3880 },
  { name: "Dallas, USA", lat: 32.7767, lng: -96.7970 },
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
  { name: "Frankfurt, Germany", lat: 50.1109, lng: 8.6821 },
  { name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Madrid, Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Osaka, Japan", lat: 34.6937, lng: 135.5023 },
  { name: "Beijing, China", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai, China", lat: 31.2304, lng: 121.4737 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne, Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver, Canada", lat: 49.2827, lng: -123.1207 },
  { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro, Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
  { name: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816 },
  { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Moscow, Russia", lat: 55.7558, lng: 37.6173 },
  { name: "Saint Petersburg, Russia", lat: 59.9311, lng: 30.3609 },
  { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Bangkok, Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Seoul, South Korea", lat: 37.5665, lng: 126.9780 },
  { name: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi, India", lat: 28.7041, lng: 77.1025 },
  { name: "Doha, Qatar", lat: 25.2854, lng: 51.5310 },
  { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
  { name: "Las Vegas, USA", lat: 36.1699, lng: -115.1398 }
  // Add more major airport hub cities to reach 50+ if needed
];

// Initialize map
function initMap() {
  map = L.map('map').setView([20,0], 2); // Center of world

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add markers
  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 8,
      color: '#fff',
      fillColor: getRandomColor(),
      fillOpacity: 1,
      weight: 2
    }).addTo(map);

    marker.on('click', () => fetchWeather(city.name));
  });
}

// Random pastel marker colors
function getRandomColor() {
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fetch weather info
async function fetchWeather(city) {
  try {
    const cleanedCity = city.split(',')[0].trim();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanedCity)}&appid=${API_KEY}&units=imperial`);
    const data = await response.json();
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
    weatherDiv.scrollIntoView({ behavior: 'smooth' });
  } catch(err) {
    alert("City not found or invalid input.");
  }
}

document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if(city) fetchWeather(city);
});

window.onload = initMap;
