const API_KEY = '56ed3783db3670e2f55ed152bb5c2a94'; // OpenWeatherMap API key

// Function to get weather by city name
async function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Please enter a city name');
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert('City not found');
  }
}

// Function to get weather by current location
async function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert('Failed to fetch weather data');
    }
  }, () => {
    alert('Unable to retrieve location');
  });
}

// Function to display weather data with more details
function displayWeather(data) {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = `
    <p><strong>City:</strong> ${data.name}</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Feels Like:</strong> ${data.main.feels_like}°C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
  `;
}
