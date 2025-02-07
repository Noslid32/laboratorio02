const api = "0811be59d4b14bd35d27c6a3a43e04ef";
const link = "https://api.openweathermap.org/data/2.5/weather";
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");
const errorMessage = document.getElementById("errorMessage");
const compareButton = document.getElementById("compareButton");
const temperatureChartCtx = document
  .getElementById("temperatureChart")
  .getContext("2d");

let temperatureChart = null;

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
    getWeatherData(city).catch((error) => {
      showError(error);
      return null;
    })
  );

  Promise.all(weatherPromises).then((results) => {
    const validResults = results.filter((data) => data !== null);

    if (validResults.length > 0) {
      validResults.forEach((data) => Datos(data));
      updateChart(
        validResults.map((data) => data.name),
        validResults.map((data) => data.main.temp)
      );
    }
  });
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
  errorMessage.innerHTML = `<p>Error: ${message}</p>`;
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

// Función para actualizar las Graficas
function updateChart(cities, temperatures) {
  console.log("Actualizando gráfico con datos:", cities, temperatures);

  if (temperatureChart) temperatureChart.destroy();

  temperatureChart = new Chart(temperatureChartCtx, {
    type: "bar",
    data: {
      labels: cities,
      datasets: [
        {
          label: "Temperatura (°C)",
          data: temperatures,
          backgroundColor: [
            "rgb(255, 140, 0)",
            "rgb(255, 215, 0)",
            "rgb(64, 224, 208)",
            "rgb(0, 102, 204)",
            "rgb(122, 233, 66 )",
            "rgb(230, 230, 250)",
          ],
          borderColor: [
            "rgb(255, 140, 0)",
            "rgb(255, 215, 0)",
            "rgb(64, 224, 208)",
            "rgb(0, 102, 204)",
            "rgb(122, 233, 66 )",
            "rgb(230, 230, 250)",
          ],
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "black",
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        title: {
          display: true,
          text: "Comparación de Temperaturas",
          color: "black",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "black",
            font: {
              size: 16,
            },
          },
        },
        y: {
          ticks: {
            color: "black",
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });
}
