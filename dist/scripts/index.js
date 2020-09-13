const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector(".show-previous-weather");

const previousWeather = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});
let selectedSolIndex;

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

      console.log(temp);
    });
};

const displaySelectedSol = (sols) => {
  return sols[selectedSolIndex];
};

getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;

  console.log(displaySelectedSol(sols));
});
