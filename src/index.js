// eslint-disable-next-line 
import css from "./style.css";
import { getWeatherInformationFiltered } from "./data.js";
import clearday from "./assets/clear-day.svg";

console.log(clearday);

const searchInput = document.querySelector("#input-wrapper > input");
const searchButton = document.querySelector("#input-wrapper > button");
const weatherInfoDiv = document.querySelector("#weather-info-wrapper");
const temperature = document.querySelector("#temperature");
const celciusButton = document.querySelector("#celcius-button");
const fahrenheitButton =  document.querySelector("#fahrenheit-button");

// Assigned by displayWeatherInformation(), accessed by temperature buttons' event handlers
let temperatureInCelcius;
let temperatureInFahrenheit;

async function displayWeatherInformation() {
    try {
        // Hide error messages if visible
        document.querySelector("#error").style.display = "none";

        // Get data to display based on input 
        const locationInput = searchInput.value;
        const weatherInfoObject = await getWeatherInformationFiltered(locationInput);

        // Display weather information once ready
        weatherInfoDiv.style.display = "block";

        // Update weather information elements with extracted information
        const location = document.querySelector("#location");
        location.textContent = weatherInfoObject.location;

        const date = document.querySelector("#date");
        date.textContent = weatherInfoObject.date;

        const conditionIcon = document.querySelector("#condition-icon");
        console.log(weatherInfoObject.conditionIcon);
        
        // Use import() for dynamic expressions as path changes after bundling
        import(`./assets/${weatherInfoObject.conditionIcon}.svg`).then((module) => {
            const iconPath = module.default;
            conditionIcon.setAttribute("src", iconPath);
        });
        
        temperatureInCelcius = Math.round(weatherInfoObject.temperature);
        temperatureInFahrenheit = Math.round((weatherInfoObject.temperature * (9 / 5)) + 32);

        // Toggle on search to refresh temperature
        fahrenheitButton.click();
        celciusButton.click();

        const condition = document.querySelector("#condition");
        condition.textContent = weatherInfoObject.condition;
 
        const precipitation = document.querySelector("#precipitation");
        precipitation.textContent = `Precipitation: ${weatherInfoObject.precipitation}%`;

        const humidity = document.querySelector("#humidity");
        humidity.textContent = `Humidity: ${weatherInfoObject.humidity}%`;

        const windSpeed = document.querySelector("#wind-speed");
        windSpeed.textContent = `Wind: ${weatherInfoObject.windSpeed} km/h`;
    } catch(error) {
        console.error(error);
        weatherInfoDiv.style.display = "none";
        document.querySelector("#error").style.display = "block";
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Initially hide the weather information wrapper on page load
    weatherInfoDiv.style.display = "none";
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        displayWeatherInformation();
    }
});

searchButton.addEventListener("click", displayWeatherInformation);

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