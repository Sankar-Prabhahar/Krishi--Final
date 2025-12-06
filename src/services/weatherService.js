import axios from "axios";

const API_KEY = "1c0ff9c24c32fb28e6644ec4110fd944";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Get current weather for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Current weather data
 */
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      },
    });
    return formatCurrentWeather(response.data);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

/**
 * Get 5-day forecast (3-hour intervals)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Forecast data
 */
export const getForecast = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      },
    });
    return formatForecast(response.data);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

/**
 * Get weather by city name
 * @param {string} city - City name
 * @returns {Promise<Object>} Current weather data
 */
export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });
    return formatCurrentWeather(response.data);
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    throw error;
  }
};

/**
 * Format current weather response
 */
const formatCurrentWeather = (data) => {
  return {
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    windDirection: data.wind.deg,
    visibility: data.visibility / 1000, // Convert to km
    clouds: data.clouds.all,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
    timestamp: new Date(data.dt * 1000),
    coord: data.coord,
  };
};

/**
 * Format forecast response - group by day
 */
const formatForecast = (data) => {
  const dailyForecasts = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        dateObj: new Date(item.dt * 1000),
        temps: [],
        humidity: [],
        descriptions: [],
        icons: [],
        rain: 0,
        windSpeeds: [],
      };
    }

    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].humidity.push(item.main.humidity);
    dailyForecasts[date].descriptions.push(item.weather[0].description);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    dailyForecasts[date].windSpeeds.push(item.wind.speed * 3.6);

    if (item.rain && item.rain["3h"]) {
      dailyForecasts[date].rain += item.rain["3h"];
    }
  });

  // Process each day to get summary
  return Object.values(dailyForecasts)
    .map((day) => ({
      date: day.date,
      dateObj: day.dateObj,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      humidity: Math.round(
        day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length
      ),
      description: getMostFrequent(day.descriptions),
      icon: getMostFrequent(day.icons),
      rain: Math.round(day.rain * 10) / 10,
      windSpeed: Math.round(
        day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length
      ),
    }))
    .slice(0, 7); // Limit to 7 days
};

/**
 * Get most frequent item in array
 */
const getMostFrequent = (arr) => {
  const frequency = {};
  let maxCount = 0;
  let mostFrequent = arr[0];

  arr.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1;
    if (frequency[item] > maxCount) {
      maxCount = frequency[item];
      mostFrequent = item;
    }
  });

  return mostFrequent;
};

/**
 * Get farming-specific weather alerts
 */
export const getFarmingAlerts = (weather, forecast) => {
  const alerts = [];

  // High temperature alert
  if (weather.temperature > 35) {
    alerts.push({
      type: "warning",
      title: "High Temperature Alert",
      message: `Temperature is ${weather.temperature}°C. Consider irrigation in early morning or evening.`,
    });
  }

  // Low humidity alert
  if (weather.humidity < 40) {
    alerts.push({
      type: "warning",
      title: "Low Humidity",
      message:
        "Humidity is low. Increase irrigation frequency to prevent crop stress.",
    });
  }

  // High humidity - disease risk
  if (weather.humidity > 80) {
    alerts.push({
      type: "warning",
      title: "High Humidity - Disease Risk",
      message:
        "Fungal disease risk is HIGH due to high humidity. Consider preventive spraying.",
    });
  }

  // Rain forecast
  const upcomingRain = forecast.find((day) => day.rain > 5);
  if (upcomingRain) {
    alerts.push({
      type: "info",
      title: "Rain Expected",
      message: `${upcomingRain.rain}mm rain expected on ${upcomingRain.date}. Postpone fertilizer application.`,
    });
  }

  // Good spraying conditions
  if (
    weather.windSpeed < 15 &&
    weather.humidity > 50 &&
    weather.humidity < 80
  ) {
    alerts.push({
      type: "success",
      title: "Good Spraying Conditions",
      message: "Current weather is ideal for pesticide/fertilizer spraying.",
    });
  }

  // High wind alert
  if (weather.windSpeed > 25) {
    alerts.push({
      type: "warning",
      title: "High Wind Alert",
      message: "Wind speed is high. Avoid spraying pesticides today.",
    });
  }

  return alerts;
};

export default {
  getCurrentWeather,
  getForecast,
  getWeatherByCity,
  getFarmingAlerts,
};
