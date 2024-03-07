import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  fetchWeatherDataForCity,
  fetchWikipediaDescriptionForCity,
} from "../utils/api";
import { City } from "../utils/types";
import { WeatherData } from "../utils/WeatherTypes";

/**
 * Custom hook to fetch weather and description data for a selected city.
 *
 * @param {City | null} selectedCity - The city selected by the user.
 * @param {Date} forecastDate - The date selected by the user for the weather forecast.
 * @param {(error: string | null) => void} setError - Function to set the error state in the parent component.
 *
 * @returns {Object} - An object containing the fetched data, loading states, and fetch functions.
 */
export const useFetchData = (
  selectedCity: City | null,
  forecastDate: Date,
  setError: (error: string | null) => void
) => {
  const [description, setDescription] = useState("");
  const [weather, setWeather] = useState<WeatherData>();
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const cancelTokenSource = useRef(axios.CancelToken.source());
  const descriptionCancelTokenSource = useRef(axios.CancelToken.source());
  const [lastFetchedCity, setLastFetchedCity] = useState<string | null>(null);

  /**
   * Validates the selected city.
   *
   * @returns {boolean} - Whether the city is valid or not.
   */
  const validateCity = () => {
    if (!selectedCity) {
      setError("Please select a city.");
      return false;
    }
    setError(null);
    return true;
  };

  /**
   * Fetches the description of the selected city from Wikipedia.
   */
  const fetchDescription = async () => {
    if (!validateCity() || lastFetchedCity === selectedCity?.name) {
      return;
    }
    setIsDescriptionLoading(true);
    // Cancel any ongoing requests
    if (descriptionCancelTokenSource.current) {
      descriptionCancelTokenSource.current.cancel();
    }
    // Create a new cancel token
    descriptionCancelTokenSource.current = axios.CancelToken.source();

    try {
      const wikipediaData = await fetchWikipediaDescriptionForCity(
        selectedCity?.name as string,
        descriptionCancelTokenSource.current.token
      );
      setDescription(wikipediaData.extract);
      setLastFetchedCity(selectedCity?.name as string);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled as selection changed", error?.message);
      } else {
        setError(
          `Failed to fetch description for city ${selectedCity?.name}: ${error?.message}`
        );
      }
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  /**
   * Fetches the weather data for the selected city and date.
   */
  const fetchWeather = async () => {
    setIsWeatherLoading(true);
    // Cancel any ongoing requests
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    // Create a new cancel token
    cancelTokenSource.current = axios.CancelToken.source();

    try {
      setError(null);
      const weatherData = await fetchWeatherDataForCity(
        selectedCity as City,
        isNaN(forecastDate.getTime()) ? new Date() : forecastDate,
        cancelTokenSource.current.token
      );
      setWeather(weatherData);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled as selection changed", error?.message);
      } else {
        setError(
          `Failed to fetch data for city ${selectedCity?.name}: ${error?.message}`
        );
      }
    } finally {
      setIsWeatherLoading(false);
    }
  };

  return {
    description,
    weather,
    isWeatherLoading,
    isDescriptionLoading,
    fetchDescription,
    fetchWeather,
  };
};
