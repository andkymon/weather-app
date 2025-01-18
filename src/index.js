// eslint-disable-next-line 
import css from "./style.css"

const input = document.querySelector("input");
const button = document.querySelector("button");

async function getWeatherInfoObject(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=2GGFS36ASKSN8ZDNPTTML7AZW&contentType=json`);
    const weatherInfoObject = await response.json();
    console.log(weatherInfoObject);
    return weatherInfoObject;
}

function extractWeatherInformation(weatherInfoObject) {
    const addressArray = weatherInfoObject.resolvedAddress.split(", ");
    const city = addressArray[0];
    const country = addressArray[addressArray.length - 1];
    console.log(city + country);
}

button.addEventListener("click", async () => {
    const location = input.value;
    const weatherInfoObject = await getWeatherInfoObject(location);
    extractWeatherInformation(weatherInfoObject);
});

