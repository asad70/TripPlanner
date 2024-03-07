import React from "react";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import { CurrentConditions, Day } from "../utils/WeatherTypes";

interface WeatherCardProps {
  weather: Day | CurrentConditions;
  heading: string;
}

/**
 * A card component to display the weather data for a selected city.
 *
 * @param {WeatherCardProps} props - The props to pass to the component.
 */
const WeatherCard: React.FC<WeatherCardProps> = ({ weather, heading }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      bg="white"
      color="gray.800"
    >
      <VStack align="start">
        <Heading size="md" color="teal.500">
          {heading}
        </Heading>
        <Text>Conditions: {weather?.conditions}</Text>
        <Text>Feels Like: {weather?.feelslike}</Text>
        <Text>Temperature: {weather?.temp} °C</Text>
      </VStack>
    </Box>
  );
};

export default WeatherCard;
