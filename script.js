const API_KEY = "83deda0e6e4f4617a4e61720252812";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const weatherBox = document.getElementById("weather");

const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const locationEl = document.getElementById("location");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsEl = document.getElementById("feels");
const iconEl = document.getElementById("icon");

// CITY AUTO-SUGGEST
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  const res = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
  );
  const data = await res.json();

  suggestions.innerHTML = "";
  data.forEach(city => {
    const div = document.createElement("div");
    div.textContent = `${city.name}, ${city.country}`;
    div.onclick = () => {
      cityInput.value = city.name;
      suggestions.style.display = "none";
      fetchWeather(city.name);
    };
    suggestions.appendChild(div);
  });

  suggestions.style.display = data.length ? "block" : "none";
});

// FETCH WEATHER
async function fetchWeather(city) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
  );
  const data = await res.json();

  tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
  conditionEl.textContent = data.current.condition.text;
  locationEl.textContent = `${data.location.name}, ${data.location.country}`;
  humidityEl.textContent = `${data.current.humidity}%`;
  windEl.textContent = `${data.current.wind_kph} km/h`;
  feelsEl.textContent = `${Math.round(data.current.feelslike_c)}°C`;
  iconEl.src = `https:${data.current.condition.icon}`;

  updateBackground(data.current.temp_c, data.current.is_day);
  weatherBox.style.display = "block";
}

// DYNAMIC BACKGROUND
function updateBackground(temp, isDay) {
  if (!isDay) {
    document.body.style.background = "linear-gradient(135deg,#141E30,#243B55)";
  } else if (temp < 15) {
    document.body.style.background = "linear-gradient(135deg,#74ebd5,#acb6e5)";
  } else if (temp < 30) {
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
  } else {
    document.body.style.background = "linear-gradient(135deg,#f7971e,#ffd200)";
  }
}

// CLICK OUTSIDE
document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});
