const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector(".show-previous-weather");

const previousWeather = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});
let selectedSolIndex;

const currrentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHeighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionText = document.querySelector("[data-wind-direction-text]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);

const previousSolTemplate = document.querySelector(
  "[data-previous-sol-template]"
);
const previousSolContainer = document.querySelector("[data-previous-sols]");

const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

const getWeather = () => {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;

      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: 46.8, //data.HWS.av
          windDirectionDegrees: 32, //data.WD.most_common.compass_degrees,
          windDirectionCardinal: "SE", //data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
};

getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits();
  unitToggle.addEventListener("click", () => {
    let metricUnits = !metricRadio.checked;
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    updateUnits();
    displaySelectedSol(sols);
    displayPreviousSols(sols);
  });

  metricRadio.addEventListener("change", () => {
    updateUnits();
    displaySelectedSol(sols);
    displayPreviousSols(sols);
  });
  imperialRadio.addEventListener("change", () => {
    updateUnits();
    displaySelectedSol(sols);
    displayPreviousSols(sols);
  });
});

const displayDate = (date) => {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
};

const displayTemperture = (temp) => {
  let returnTemp = temp;
  if (!isMetric()) return Math.round(returnTemp - (temp - 32) * (5 / 9));
  return Math.round(temp);
};

const displaySpeed = (speed) => {
  if (!isMetric()) return Math.round(speed * 0.62);
  return Math.round(speed);
};

const displayPreviousSols = (sols) => {
  previousSolContainer.innerHTML = " ";
  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector("[data-sol]").innerText = solData.sol;
    solContainer.querySelector("[data-temp-high]").innerText = displaySpeed(
      solData.maxTemp
    );
    solContainer.querySelector("[data-temp-low]").innerText = displayTemperture(
      solData.minTemp
    );
    solContainer
      .querySelector("[data-select-button]")
      .addEventListener("click", () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });
    previousSolContainer.appendChild(solContainer);
  });
};
const displaySelectedSol = (sols) => {
  const selectedSol = sols[selectedSolIndex];
  currrentSolElement.innerText = selectedSol.sol;
  currentDateElement.innerText = displayDate(selectedSol.date);
  currentTempHeighElement.innerText = displayTemperture(selectedSol.maxTemp);
  currentTempLowElement.innerText = displayTemperture(selectedSol.minTemp);
  windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
  windDirectionArrow.style.setProperty(
    "--direction",
    `${selectedSol.windDirectionDegrees}deg`
  );
  windDirectionText.innerText = selectedSol.windDirectionCardinal;
};

const updateUnits = () => {
  const speedUnits = document.querySelectorAll("[data-speed-unit]");
  const tempUnits = document.querySelectorAll("[data-temp-unit]");
  speedUnits.forEach((unit) => {
    unit.innerText = isMetric() ? "kph" : "mph";
  });

  tempUnits.forEach((unit) => {
    unit.innerText = isMetric() ? "C" : "F";
  });
};

const isMetric = () => metricRadio.checked;
