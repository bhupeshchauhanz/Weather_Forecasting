const API_KEY = '56ed3783db3670e2f55ed152bb5c2a94'; //OpenWeatherMap API key

// Function to fetch weather by city name
async function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  fetchWeatherData(`q=${city}`);
}

// Function to fetch weather by location
async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
      },
      () => alert('Could not get location')
    );
  } else {
    alert('Geolocation not supported');
  }
}

// Function to fetch weather data and update UI
async function fetchWeatherData(query) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`);
  const data = await response.json();

  // Current Weather
  document.getElementById('temperature').innerText = `${data.main.temp}°C`;
  document.getElementById('description').innerText = data.weather[0].description;
  document.getElementById('date').innerText = new Date().toLocaleDateString();
  document.getElementById('location').innerText = data.name;

  // Highlights
  document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById('pressure').innerText = `Pressure: ${data.main.pressure} hPa`;
  document.getElementById('visibility').innerText = `Visibility: ${data.visibility / 1000} km`;
  document.getElementById('feelsLike').innerText = `Feels Like: ${data.main.feels_like}°C`;
}

// Add more functions here if needed for 5-day forecast and AQI data
