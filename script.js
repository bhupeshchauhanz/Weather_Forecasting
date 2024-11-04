const API_KEY = '56ed3783db3670e2f55ed152bb5c2a94'; // OpenWeatherMap API key

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
        fetchAirQuality(latitude, longitude); // Get air quality for location
        getFiveDayForecast(`lat=${latitude}&lon=${longitude}`); // Get forecast for location
      },
      () => alert('Could not get location')
    );
  } else {
    alert('Geolocation not supported');
  }
}

// Function to fetch weather data and update UI
async function fetchWeatherData(query) {
  try {
    showLoading(true);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('Weather data not found');
    const data = await response.json();

    // Current Weather
    document.getElementById('temperature').innerText = `${data.main.temp}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('date').innerText = new Date().toLocaleDateString();
    document.getElementById('location').innerText = data.name;

    // Highlights
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('pressure').innerText = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('visibility').innerText = `Visibility: ${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('feelsLike').innerText = `Feels Like: ${data.main.feels_like}°C`;
    document.getElementById('sunTimes').innerText = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()} | Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
  } catch (error) {
    alert(error.message);
  } finally {
    showLoading(false);
  }
}

// Function to fetch 5-day forecast
async function getFiveDayForecast(query) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('Forecast data not found');
    const data = await response.json();

    const forecastItemsContainer = document.getElementById('forecastItems');
    forecastItemsContainer.innerHTML = ''; // Clear previous forecast items

    data.list.forEach((item, index) => {
      if (index % 8 === 0) { // Every 8th item represents a new day
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
          <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
          <p>${item.main.temp}°C</p>
          <p>${item.weather[0].description}</p>
        `;
        forecastItemsContainer.appendChild(forecastItem);
      }
    });
  } catch (error) {
    alert(error.message);
  }
}

// Function to fetch air quality data
async function fetchAirQuality(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Air quality data not found');
    const data = await response.json();
    document.getElementById('airQuality').innerText = `Air Quality Index: ${data.list[0].main.aqi}`;
  } catch (error) {
    alert(error.message);
  }
}

// Show loading indicator
function showLoading(isLoading) {
  const loadingElement = document.getElementById('loading');
  if (isLoading) {
    loadingElement.style.display = 'block';
  } else {
    loadingElement.style.display = 'none';
  }
}

// Add event listeners to search buttons
document.getElementById('cityInput').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    getWeatherByCity();
  }
});
