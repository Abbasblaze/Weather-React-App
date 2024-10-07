import{ useState, useEffect } from "react";
import clear_icon from "./assets/clear.png";
import clouds_icon from "./assets/clouds.png";
import mist_icon from "./assets/mist.png";
import rain_icon from "./assets/rain.png";
import snow_icon from "./assets/snow.png";
import wind_icon from "./assets/wind.png";
import drizzle_icon from "./assets/drizzle.png";

const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": clouds_icon,
  "02n": mist_icon,
  "03d": clouds_icon,
  "03n": clouds_icon,
  "04d": rain_icon,
  "04n": rain_icon,
  "09d": drizzle_icon,
  "09n": drizzle_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "11d": wind_icon,
  "11n": wind_icon,
  "13d": snow_icon,
  "13n": snow_icon,
  "50d": mist_icon,
  "50n": mist_icon,
};

const cities = ["New York", "London", "Paris", "Layyah", "Sydney"];

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [cityWeather, setCityWeather] = useState([]);

  const handleSearch = async () => {
    try {
      
      const apiKey = import.meta.env.VITE_APP_ID;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const weatherIcon = data.weather[0].icon;

        setWeatherData({
          temperature: data.main.temp,
          cityName: data.name,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          weatherIcon: weatherIcon,
        });
        setShowWeather(true);
      } else {
        console.error(data.message);
        setShowWeather(false);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setShowWeather(false);
    }
  };

  const clickHandler = async () => {
    // const apiKey = import.meta.env.VITE_APP_ID;
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  }

  const fetchCityWeather = async (cityName) => {
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        return {
          cityName: data.name,
          temperature: data.main.temp,
          weatherIcon: data.weather[0].icon,
        };
      }
    } catch (error) {
      console.error("Error fetching city weather data:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAllCityWeather = async () => {
      const cityWeatherData = await Promise.all(
        cities.map((city) => fetchCityWeather(city))
      );
      setCityWeather(cityWeatherData.filter(Boolean));
    };

    fetchAllCityWeather();
  }, [
    
  ]);

  return (
    <div className="w-[90%] max-w-[470px] bg-gradient-to-r from-[#00feba] to-[#5b548a] text-white mx-auto mt-24 rounded-lg p-10 text-center">
      <div className="w-full flex items-center justify-between">
        <input
          type="text"
          placeholder="Enter city name"
          spellCheck="false"
          className="border-0 outline-none bg-[#ebfffc] text-gray-700 py-2.5 px-6 h-16 rounded-lg flex-1 mr-4 text-lg"
          value={city}
          onChange={(e) => setCity(e.target.value )}
          
        />
        <button
          onClick={handleSearch}
          className="border-0 outline-none bg-[#ebfffc] rounded-full w-16 h-16 flex justify-center items-center cursor-pointer"
        >
          <img src="src/assets/search.png" alt="Search" className="w-4" />
        </button>
      </div>

      {showWeather && weatherData && (
        <div className="weather mt-8">
          <img
            src={allIcons[weatherData.weatherIcon]}
            alt="Weather icon"
            className="w-20 mt-8 mx-auto"
          />
          <h1 className="text-7xl font-medium mt-4">{weatherData.temperature}°C</h1>
          <h2 className="text-5xl font-normal mt-2">{weatherData.cityName}</h2>

          <div className="details flex items-center justify-between px-5 mt-12">
            <div className="col flex items-center text-left">
              <img
                src="src/assets/humidity.png"
                alt="Humidity"
                className="w-10 mr-2.5"
              />
              <div>
                <p className="text-2xl -mt-1">{weatherData.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>

            <div className="col flex items-center text-left">
              <img
                src="src/assets/wind.png"
                alt="Wind speed"
                className="w-10 mr-2.5"
              />
              <div>
                <p className="text-2xl -mt-1">{weatherData.windSpeed} km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}

     
      <div className="city-weather mt-12">
        <h3 className="text-2xl font-semibold mb-4">Weather in other cities:</h3>
        <div className="grid grid-cols-1 gap-4">
          {cityWeather.map((city) => (
            <div key={city.cityName} className="bg-white text-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <img src={allIcons[city.weatherIcon]} alt="Weather icon" className="w-12 mr-4" />
                <div>
                  <h4 className="text-lg font-semibold">{city.cityName}</h4>
                  <p>{city.temperature}°C</p>
                </div>
              </div>
              <div onClick={clickHandler}>
              <i className="ri-arrow-right-line"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
