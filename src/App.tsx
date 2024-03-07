import React, { useState, useRef } from "react";
import { City } from "./utils/types";
import {
  ChakraProvider,
  Box,
  Text,
  Alert,
  Flex,
  Heading,
  VStack,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { cities } from "./utils/constants";
import { addDays, format } from "date-fns";
import WeatherCard from "./components/WeatherCard";
import CitySelect from "./components/CitySelect";
import DateSelect from "./components/DateSelect";
import { useFetchData } from "./hooks/useFetchData";

function App() {
  const [forecastDate, setForecastDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    description,
    weather,
    isWeatherLoading,
    isDescriptionLoading,
    fetchDescription,
    fetchWeather,
  } = useFetchData(selectedCity, forecastDate, setError);

  /*
   * Handles the change event for the date input.
   *
   * @param {object} event - The change event object.
   */
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value + "T00:00");
    if (!validateDate(selectedDate)) {
      return;
    }
    setForecastDate(selectedDate);
    setError(null);
  };

  /*
   * Handles the change event for the city select input.
   *
   * @param {object} event - The change event object.
   */
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityName = event.target.value;
    const city = cities.find((city: City) => city.name === selectedCityName);
    setSelectedCity(city || null);
    setError(null);
  };

  const validateDate = (selectedDate: Date) => {
    // Check if a date is selected
    if (!selectedDate) {
      setError("Please select a date.");
      return false;
    }

    // Check if the selected date is a future date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison
    if (selectedDate.getTime() < currentDate.getTime()) {
      setError("Please select a future date.");
      return false;
    }

    // Check if the selected date is within the next 5 days
    const maxDate = addDays(currentDate, 5);
    maxDate.setHours(23, 59, 59, 999); // Set the time to the end of the day for accurate comparison
    if (selectedDate.getTime() > maxDate.getTime()) {
      setError("Please select a date within the next 5 days.");
      return false;
    }

    // If all checks pass, clear any existing error and return true
    setError(null);
    return true;
  };

  /*
   * Fetches the weather and description data for the selected city and date.
   */
  const fetchData = async () => {
    await fetchDescription();
    await fetchWeather();
  };

  const isButtonDisabled =
    isWeatherLoading || !selectedCity || !!error || isDescriptionLoading;
  const isButtonLoading = isWeatherLoading || isDescriptionLoading;

  return (
    <ChakraProvider>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        width={"100%"}
        bgGradient="linear(to-r, teal.500,green.500)"
        color="gray.200"
        p={4}
      >
        <Box
          p={8}
          maxW="lg"
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          color="gray.800"
          minH="lg"
          minW="lg"
          transition="all 0.2s"
        >
          <VStack spacing={4} align="stretch">
            <Heading
              textAlign="center"
              size="xl"
              fontWeight="extrabold"
              color="teal.300"
            >
              Trip Planner
            </Heading>
            <CitySelect onChange={handleCityChange} />
            <DateSelect onChange={handleDateChange} />
            <Button
              onClick={fetchData}
              colorScheme="teal"
              size="md"
              mt={4}
              isLoading={isButtonLoading}
              loadingText="Discovering..."
              isDisabled={isButtonDisabled}
            >
              Discover
            </Button>
            {error && (
              <Alert status="error" color="black">
                {error}
              </Alert>
            )}
            {description && (
              <>
                <Text fontSize="md" fontWeight="bold" color="teal.500" mb={0}>
                  Description:
                </Text>
                <Skeleton isLoaded={!isDescriptionLoading}>
                  <Text>{description}</Text>
                </Skeleton>
              </>
            )}
            {weather?.currentConditions && (
              <Skeleton isLoaded={!isWeatherLoading}>
                <WeatherCard
                  key={weather?.currentConditions?.datetime}
                  weather={weather?.currentConditions}
                  heading="Current Weather:"
                />
              </Skeleton>
            )}
          </VStack>
          {weather?.days
            .filter((day) => day.datetime !== format(new Date(), "yyyy-MM-dd"))
            .map((day, index) => (
              <Skeleton key={day?.datetime} isLoaded={!isWeatherLoading}>
                <WeatherCard
                  weather={day}
                  heading={`Day ${index + 1}: ${day?.datetime}`}
                />
              </Skeleton>
            ))}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
