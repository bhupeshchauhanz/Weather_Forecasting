const API_KEY = '56ed3783db3670e2f55ed152bb5c2a94';

// Function to fetch weather by city name
async function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  try {
    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData && geocodeData.length > 0) {
      const { lat, lon } = geocodeData[0];
      fetchWeatherData(lat, lon);
    } else {
      alert('City not found. Please check the spelling or try a different city.');
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    alert('Unable to retrieve data for the specified city. Please try again later.');
  }
}

// Function to fetch weather by current location
async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(latitude, longitude);
    }, () => alert('Could not get location'));
  } else {
    alert('Geolocation not supported');
  }
}

// Function to fetch weather data
async function fetchWeatherData(lat, lon) {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  
    const [weatherResponse, forecastResponse, airQualityResponse] = await Promise.all([
      fetch(weatherUrl), fetch(forecastUrl), fetch(airQualityUrl)
    ]);
    
    if (!weatherResponse.ok || !forecastResponse.ok || !airQualityResponse.ok) {
      throw new Error('Error fetching data from one or more APIs');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    const airQualityData = await airQualityResponse.json();
  
    updateCurrentWeather(weatherData);
    updateHighlights(weatherData, airQualityData);
    updateForecast(forecastData);
    updateHourlyForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert('Error retrieving weather data. Please try again later.');
  }
}

// Function to update current weather details
function updateCurrentWeather(data) {
  document.getElementById('temperature').innerText = `${data.main.temp}°C`;
  document.getElementById('description').innerText = data.weather[0].description;
  document.getElementById('date').innerText = new Date().toLocaleDateString();
  document.getElementById('location').innerText = data.name;
}

// Function to update highlights
function updateHighlights(weatherData, airQualityData) {
  document.getElementById('humidity').innerText = `Humidity: ${weatherData.main.humidity}%`;
  document.getElementById('pressure').innerText = `Pressure: ${weatherData.main.pressure} hPa`;
  document.getElementById('visibility').innerText = `Visibility: ${(weatherData.visibility / 1000).toFixed(1)} km`;
  document.getElementById('feelsLike').innerText = `Feels Like: ${weatherData.main.feels_like}°C`;

  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById('sunTimes').innerText = `Sunrise: ${sunrise} | Sunset: ${sunset}`;

  const airQualityIndex = airQualityData.list[0].main.aqi;
  const airQualityText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  document.getElementById('airQuality').innerText = `Air Quality: ${airQualityText[airQualityIndex - 1]}`;
}

// Function to update 5-day forecast
function updateForecast(forecastData) {
  const forecastItems = document.getElementById('forecastItems');
  forecastItems.innerHTML = '';
  forecastData.list.forEach((item, index) => {
    if (index % 8 === 0) { // Show one forecast per day
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.innerHTML = `<p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                                <p>${item.main.temp}°C</p>
                                <p>${item.weather[0].description}</p>`;
      forecastItems.appendChild(forecastItem);
    }
  });
}

// Function to update hourly forecast with wind speed and direction
function updateHourlyForecast(forecastData) {
  const hourlyForecast = document.getElementById('hourlyForecast');
  hourlyForecast.innerHTML = '';
  forecastData.list.slice(0, 5).forEach((item) => { // Show first 5 items as hourly forecast
    const windSpeed = item.wind.speed;
    const windDirection = getWindDirection(item.wind.deg);
    const forecastItem = document.createElement('div');
    forecastItem.className = 'hourly-forecast-item';
    forecastItem.innerHTML = `<p>${new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              <p>${item.main.temp}°C</p>
                              <p>${item.weather[0].description}</p>
                              <p>Wind: ${windSpeed} m/s ${windDirection}</p>`;
    hourlyForecast.appendChild(forecastItem);
  });
}

// Function to convert wind direction from degrees to compass direction
function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
