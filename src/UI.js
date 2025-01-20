import { getWeatherInformationFiltered } from "./data.js";

export const UI = (function () {
    const searchInput = document.querySelector("#input-wrapper > input");
    const searchButton = document.querySelector("#input-wrapper > button");
    const weatherInfoDiv = document.querySelector("#weather-info-wrapper");
    const temperature = document.querySelector("#temperature");
    const celciusButton = document.querySelector("#celcius-button");
    const fahrenheitButton =  document.querySelector("#fahrenheit-button");
    const loaderSpinner = document.querySelector("#loader");
    const errorDiv = document.querySelector("#error");


    // Assigned by displayWeatherInformation(), accessed by temperature buttons' event handlers
    let temperatureInCelcius;
    let temperatureInFahrenheit;

    async function displayWeatherInformation() {
        try {
            // Hide any elements displayed below input
            hideElements();

            // Display loader while waiting
            loaderSpinner.style.display = "block";

            // Retrieve data to display based on input 
            const locationInput = searchInput.value;
            const weatherInfoObject = await getWeatherInformationFiltered(locationInput);

            // Hide loader and display weather information once ready 
            loaderSpinner.style.display = "none";
            weatherInfoDiv.style.display = "block";

            // Update weather information elements based on retrieved information
            updateLocation(weatherInfoObject.location);
            updateConditionIcon(weatherInfoObject.conditionIcon);
            updateTemperature(weatherInfoObject.temperature);
            updateCondition(weatherInfoObject.condition);
            updatePrecipitation(weatherInfoObject.precipitation);
            updateHumidity(weatherInfoObject.humidity);
            updateWindSpeed(weatherInfoObject.windSpeed); 
        } catch(error) {
            handleError(error);
        }
    }

    function hideElements() {
        weatherInfoDiv.style.display = "none";
        errorDiv.style.display = "none";
        loaderSpinner.style.display = "none";
    }

    function updateLocation(location) {
        const locationDiv = document.querySelector("#location");
        locationDiv.textContent = location;
    }

    function updateConditionIcon(conditionIconString) {
        const conditionIconDiv = document.querySelector("#condition-icon");

        // Use import() for dynamic expressions as path changes after bundling
        import(`./assets/${conditionIconString}.svg`).then((module) => {
            const iconPath = module.default;
            conditionIconDiv.setAttribute("src", iconPath);
        });
    }

    function updateTemperature(temperature) {
        temperatureInCelcius = Math.round(temperature);
        temperatureInFahrenheit = Math.round((temperature * (9 / 5)) + 32);

        // Toggle on search to refresh temperature after assignment
        fahrenheitButton.click();
        celciusButton.click();
    }

    function updateCondition(condition) {
        const conditionDiv = document.querySelector("#condition");
        conditionDiv.textContent = condition;
    }
    
    function updatePrecipitation(precipitation) {
        const precipitationDiv = document.querySelector("#precipitation");
        precipitationDiv.textContent = `Precipitation: ${precipitation}%`;
    }

    function updateHumidity(humidity) {
        const humidityDiv = document.querySelector("#humidity");
        humidityDiv.textContent = `Humidity: ${humidity}%`;
    }

    function updateWindSpeed(windSpeed) {
        const windSpeedDiv = document.querySelector("#wind-speed");
        windSpeedDiv.textContent = `Wind: ${windSpeed} km/h`;
    }

    function handleError(error) {
        console.error(error);
        hideElements();
        errorDiv.style.display = "block";
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
})();
    