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
const windDirectionText = document.querySelector("[date-wind-direction-text]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);

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
          windDirectionDegrees: 180, //data.WD.most_common.compass_degrees,
          windDirectionCardinal: "SE", //data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
};

getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
});

const displayDate = (date) => {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
};

const displayTemperture = (temp) => {
  return Math.round(temp);
};

const displaySpeed = (speed) => {
  return Math.round(speed);
};

const displaySelectedSol = (sols) => {
  const selectedSol = sols[selectedSolIndex];
  console.log(selectedSol);
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
