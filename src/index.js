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

button.addEventListener("click", searchEventHandler);

input.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        searchEventHandler();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    weatherInfo.style.display = "none";
});

//

async function searchEventHandler() {
    
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
    temperature.textContent = weatherInfoObject.temperature;

    //TODO: Celcius and Farenheit conversion

    const condition = document.querySelector("#condition");
    condition.textContent = weatherInfoObject.condition;

    const precipitation = document.querySelector("#precipitation");
    precipitation.textContent = `Precipitation: ${weatherInfoObject.precipitation}%`;

    const humidity = document.querySelector("#humidity");
    humidity.textContent = `Humidity: ${weatherInfoObject.humidity}%`;

    const windSpeed = document.querySelector("#wind-speed");
    windSpeed.textContent = `Wind: ${weatherInfoObject.windSpeed} km/h`;
}
