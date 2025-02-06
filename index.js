const api = "0811be59d4b14bd35d27c6a3a43e04ef";
const link = "https://api.openweathermap.org/data/2.5/weather";
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");
const errorMessage = document.getElementById("errorMessage");
const compareButton = document.getElementById("compareButton");

compareButton.addEventListener("click", () => {
  const cities = cityInput.value
    .split(",")
    .map((city) => city.trim())
    .filter((city) => city !== "");
  if (cities.length === 0) {
    showError("Por favor, ingresa al menos una ciudad");
    return;
  }

  weatherCards.innerHTML = "";
  errorMessage.classList.add("d-none");

  const weatherPromises = cities.map((city) =>
    getWeatherData(city)
      .then(Datos)
      .catch((error) => showError(error))
  );

  Promise.allSettled(weatherPromises);
});

function getWeatherData(city) {
  return fetch(
    `${link}?q=${encodeURIComponent(city)}&units=metric&appid=${api}`
  ).then((response) => {
    if (!response.ok) throw `Ciudad "${city}" no encontrada`;
    return response.json();
  });
}

function showError(message) {
  errorMessage.innerHTML += `<p>Error: ${message}</p>`;
  errorMessage.classList.remove("d-none");
}

function Datos(data) {
  const card = document.createElement("div");
  card.className = "col-md-4";
  card.innerHTML = `
    <div class="card weather-card">
      <div class="card-body text-center">
        <h5 class="card-title">${data.name}, ${data.sys.country} <i class="fas fa-map-marker-alt text-info"></i></h5>
        <p class="card-text"><i class="fas fa-temperature-high text-danger"></i> Temperatura: ${data.main.temp} °C</p>
        <p class="card-text"><i class="fas fa-cloud text-primary"></i>Clima: ${data.weather[0].description}</p>
        <p class="card-text"><i class="fas fa-tint text-info"></i>Humedad: ${data.main.humidity}%</p>
      </div>
    </div>
  `;
  weatherCards.appendChild(card);
}
