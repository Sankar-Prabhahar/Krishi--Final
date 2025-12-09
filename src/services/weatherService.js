const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherService = {
  // Get current weather for given coordinates
  getCurrentWeather: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data fetch failed");
      }

      const data = await response.json();

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        feelsLike: data.main.feels_like,
        location: data.name,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Fallback to mock data
      return {
        temperature: 28,
        humidity: 65,
        description: "Partly Cloudy",
        icon: "02d",
        windSpeed: 12,
        pressure: 1013,
        feelsLike: 30,
        location: "Your Location",
      };
    }
  },

  // Get 5-day forecast
  getForecast: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Forecast data fetch failed");
      }

      const data = await response.json();

      // Process forecast data - get one entry per day at 12:00
      const dailyForecasts = [];
      const processedDates = new Set();

      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toISOString().split("T")[0];

        if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            date: dateStr,
            temp: item.main.temp,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            rainfall: item.rain ? item.rain["3h"] || 0 : 0,
          });
        }
      });

      return dailyForecasts;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      // Fallback to mock data
      return Array(7)
        .fill(null)
        .map((_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
          temp: 28 + Math.random() * 4,
          tempMin: 24 + Math.random() * 2,
          tempMax: 30 + Math.random() * 3,
          humidity: 60 + Math.random() * 10,
          description: "Partly Cloudy",
          icon: "02d",
          rainfall: Math.random() > 0.7 ? Math.random() * 10 : 0,
        }));
    }
  },

  // Get user's geolocation
  getUserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default to Delhi coordinates as fallback
          resolve({
            lat: 28.6139,
            lon: 77.209,
          });
        }
      );
    });
  },
};
