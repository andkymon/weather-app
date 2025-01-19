// eslint-disable-next-line 
import css from "./style.css";
import { format } from "date-fns";

// Prepare the Data
async function getWeatherInfoObject(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=2GGFS36ASKSN8ZDNPTTML7AZW&contentType=json`);
    const weatherInfoObject = await response.json();
    console.log(weatherInfoObject);
    return weatherInfoObject;
}

// Only extract necessary information
function filterCurrentWeatherInformation(weatherInfoObject) {
    // TODO: Split these into own functions
    // Location (City, Country)
    let location;

    const addressArray = weatherInfoObject.resolvedAddress.split(", ");
    const city = addressArray[0];
    const country = addressArray[addressArray.length - 1];

    if (city === country) {
        location = country;
        console.log(location);
    } else {
        location = city + ", " + country;
        console.log(location);
    }

    //Date (Day, MM/DD/YYYY)
    const dateInMilliseconds = weatherInfoObject.currentConditions.datetimeEpoch * 1000;
    const date = format(new Date(dateInMilliseconds), "p, iiii, P");
    console.log(date);

    //Temperature (Celcius)
    const temperature = weatherInfoObject.currentConditions.temp;
    console.log(temperature + "°C");

    //Weather condition
    const condition = weatherInfoObject.currentConditions.conditions;
    console.log(condition);

    //Precipitation
    const precipitation = weatherInfoObject.currentConditions.precipprob;
    console.log("Precipitation: " + precipitation + "%");

    //Humidity
    const humidity = weatherInfoObject.currentConditions.humidity;
    console.log("Humidity: " + humidity + "%");

    //Wind Speed
    const windSpeed = weatherInfoObject.currentConditions.windspeed;
    console.log("Wind: " + windSpeed + "km/h");

    return {
        location,
        date,
        temperature,
        condition,
        precipitation,
        humidity,
        windSpeed
    }
}

//EVENT LISTENERS
const input = document.querySelector("input");
const button = document.querySelector("button");

const weatherInfo = document.querySelector("#weather-info-wrapper");

button.addEventListener("click", ()=> {
    searchEventHandler().catch(()=> document.querySelector("#error").style.display = "block");
});

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchEventHandler().catch(()=> document.querySelector("#error").style.display = "block");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    weatherInfo.style.display = "none";
});

//

async function searchEventHandler() {
    document.querySelector("#error").style.display = "none";
    const locationInput = input.value;
    const weatherInfoObjectRaw = await getWeatherInfoObject(locationInput);
    const weatherInfoObject = filterCurrentWeatherInformation(weatherInfoObjectRaw);

    // Display UI once information is ready
    weatherInfo.style.display = "block";

    // Update UI with extracted info
    const location = document.querySelector("#location");
    location.textContent = weatherInfoObject.location;

    const date = document.querySelector("#date");
    date.textContent = weatherInfoObject.date;

    const temperature = document.querySelector("#temperature");
    const temperatureInCelcius = Math.round(weatherInfoObject.temperature);
    const temperatureInFahrenheit = Math.round((weatherInfoObject.temperature * (9 / 5)) + 32);

    //Celcius and Farenheit conversion
    const celciusButton = document.querySelector("#celcius-button");
    const fahrenheitButton =  document.querySelector("#fahrenheit-button");

    celciusButton.addEventListener("click", () => {
        celciusButton.disabled = true;
        fahrenheitButton.disabled = false;
        temperature.textContent = temperatureInCelcius;
    });

    fahrenheitButton.addEventListener("click", () => {
        fahrenheitButton.disabled = true;
        celciusButton.disabled = false;
        temperature.textContent = temperatureInFahrenheit;
    });

    // Toggle on search to refresh temperature
    fahrenheitButton.click();
    celciusButton.click();

    const condition = document.querySelector("#condition");
    condition.textContent = weatherInfoObject.condition;

    //TODO: Icon based on condition

    const precipitation = document.querySelector("#precipitation");
    precipitation.textContent = `Precipitation: ${weatherInfoObject.precipitation}%`;

    const humidity = document.querySelector("#humidity");
    humidity.textContent = `Humidity: ${weatherInfoObject.humidity}%`;

    const windSpeed = document.querySelector("#wind-speed");
    windSpeed.textContent = `Wind: ${weatherInfoObject.windSpeed} km/h`;
}
