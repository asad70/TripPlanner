import axios, { CancelToken } from "axios";
import { City } from "./types";
import { WeatherData } from "./WeatherTypes";
import { WikipediaResponse } from "./WikipediaTypes";

// Base URLs for the APIs
const VISUAL_CROSSING_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";

/**
 * Formats a date object to 'YYYY-MM-DD' string.
 * @param date The date to format.
 * @returns The formatted date string.
 */
const formatDate = (date: Date): string => {
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
};

/**
 * Fetches weather data for a given city from the Open-Meteo API.
 * @param city The city for which to fetch weather data.
 * @param forecastedDate The date for which to fetch the weather data.
 * @returns A promise that resolves to the weather data.
 * @throws Will throw an error if the request fails.
 */
export const fetchWeatherDataForCity = async (
  city: City,
  forecastedDate: Date,
  cancelToken: CancelToken
): Promise<WeatherData> => {
  const todayDateString = formatDate(new Date());
  const forecastedDateString = formatDate(forecastedDate);

  try {
    const response = await axios.get(
      `${VISUAL_CROSSING_BASE_URL}/${city.name}/${todayDateString}/${forecastedDateString}?unitGroup=metric&include=days,current&key=${process.env.REACT_APP_VISUAL_CROSSING_API_KEY}&contentType=json`,
      { cancelToken }
    );
    return response.data as WeatherData;
  } catch (error) {
    console.error(`Failed to fetch weather data for city ${city.name}:`, error);
    throw error;
  }
};

/**
 * Fetches the Wikipedia description for a given city.
 * @param cityName The city for which to fetch the description.
 * @param cancelToken The cancel token to cancel the request.
 * @returns A promise that resolves to the Wikipedia description.
 * @throws Will throw an error if the request fails.
 */
export const fetchWikipediaDescriptionForCity = async (
  cityName: string,
  cancelToken: CancelToken
): Promise<WikipediaResponse> => {
  try {
    const response = await axios.get(`${WIKIPEDIA_BASE_URL}/${cityName}`, {
      cancelToken,
    });
    return response.data as WikipediaResponse;
  } catch (error) {
    console.error(
      `Failed to fetch Wikipedia description for city ${cityName}:`,
      error
    );
    throw error;
  }
};
