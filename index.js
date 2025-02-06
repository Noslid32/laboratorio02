const api = "0811be59d4b14bd35d27c6a3a43e04ef";
const link = "https://api.openweathermap.org/data/2.5/weather";
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");
const errorMessage = document.getElementById("errorMessage");
const compareButton = document.getElementById("compareButton");

compareButton.addEventListener("click", () => {
  const cities = cityInput.value.split(",").map((city) => city.trim()); // Divide las ciudades
  if (cities.length === 0 || cities[0] === "") {
    showError("Por favor, ingresa al menos una ciudad");
    return;
  }

  weatherCards.innerHTML = ""; // Limpia los resultados previos
  errorMessage.classList.add("d-none"); // Oculta errores previos

  // Realiza todas las consultas en paralelo
  Promise.all(cities.map((city) => getWeatherData(city)))
    .then((results) => results.forEach(Datos)) // Muestra cada resultado en tarjetas
    .catch(showError); // Muestra error si una ciudad falla
});

function getWeatherData(city) {
  return new Promise((resolve, reject) => {
    const url = `${link}?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${api}`;
    fetch(url)
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(`Ciudad "${city}" no encontrada`)
      )
      .then(resolve)
      .catch(reject);
  });
}

function showError(message) {
  errorMessage.textContent = `Error: ${message}`;
  errorMessage.classList.remove("d-none");
}

function Datos(data) {
  const card = document.createElement("div");
  card.className = "col-md-4";
  card.innerHTML = `
      <div class="card">
        <div class="card-body text-center">
          <h5 class="card-title">${data.name}, ${data.sys.country}</h5>
          <p class="card-text">Temperatura: ${data.main.temp} °C</p>
          <p class="card-text">Clima: ${data.weather[0].description}</p>
          <p class="card-text">Humedad: ${data.main.humidity}%</p>
        </div>
      </div>
    `;
  weatherCards.appendChild(card);
}
