import { format } from "date-fns";

// Fetch the data and parse it as an object
async function getWeatherInformationRaw(locationInput) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationInput}?unitGroup=metric&key=2GGFS36ASKSN8ZDNPTTML7AZW&contentType=json`);
    const weatherInfoObject = await response.json();
    return weatherInfoObject;
}

// Only extract necessary information from the 
function filterWeatherInformation(weatherInfoObject) {
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

    //Weather condition icon
    const conditionIcon = weatherInfoObject.currentConditions.icon;

    //Temperature (Celcius)
    const temperature = weatherInfoObject.currentConditions.temp;

    //Weather condition
    const condition = weatherInfoObject.currentConditions.conditions;

    //Precipitation
    const precipitation = weatherInfoObject.currentConditions.precipprob;

    //Humidity
    const humidity = weatherInfoObject.currentConditions.humidity;

    //Wind Speed
    const windSpeed = weatherInfoObject.currentConditions.windspeed;

    return {
        location,
        date,
        conditionIcon,
        temperature,
        condition,
        precipitation,
        humidity,
        windSpeed
    }
}

export async function getWeatherInformationFiltered(locationInput) {
    const raw = await getWeatherInformationRaw(locationInput);
    const filtered = filterWeatherInformation(raw);
    return filtered;
}