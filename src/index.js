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
function extractCurrentWeatherInformation(weatherInfoObject) {
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
    const date = format(new Date(), "iiii, P");
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

button.addEventListener("click", async () => {
    weatherInfo.style.display = "block";
    const location = input.value;
    const weatherInfoObject = await getWeatherInfoObject(location);
    extractCurrentWeatherInformation(weatherInfoObject);
});

input.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        weatherInfo.style.display = "block";

        const location = input.value;
        const weatherInfoObject = await getWeatherInfoObject(location);
        extractCurrentWeatherInformation(weatherInfoObject);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    weatherInfo.style.display = "none";
});

//INITIALLY HIDE WEATHER INFO ON LOAD
//TITLE AND INPUT CENTERED
