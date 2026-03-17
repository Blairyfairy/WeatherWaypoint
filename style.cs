const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap key
let map;

function getRandomColor() {
  const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#F5A623'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 4,
  });

  const locations = [
    { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445 },
    { name: "Golden Gate Bridge", lat: 37.8199, lng: -122.4783 },
    { name: "Disney World", lat: 28.3852, lng: -81.5639 },
  ];

  locations.forEach(loc => {
    const marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: map,
      title: loc.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: getRandomColor(),
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#fff'
      },
      animation: google.maps.Animation.DROP
    });

    marker.addListener("click", () => fetchWeather(loc.name));
  });
}

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
  } catch (err) {
    alert(err.message);
  }
}

document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if(city) fetchWeather(city);
});

window.onload = initMap;
