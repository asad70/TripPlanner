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
import { format } from "date-fns";
import WeatherCard from "./components/WeatherCard";
import CitySelect from "./components/CitySelect";
import DateSelect from "./components/DateSelect";
import { useFetchData } from "./hooks/useFetchData";
import { validateDate } from "./utils/utils";

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
    setForecastDate(selectedDate);
    if (!validateDate(selectedDate, setError)) {
      return;
    }
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
          p={{ base: 4, md: 8 }}
          maxW={{ base: "90%", md: "lg" }}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          color="gray.800"
          minH={{ base: "90%", md: "lg" }}
          minW={{ base: "90%", md: "lg" }}
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
