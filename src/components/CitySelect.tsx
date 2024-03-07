import { Select } from "@chakra-ui/react";
import { cities } from "../utils/constants";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * A select input component to allow the user to select a city.
 *
 * @param {function} onChange - The function to call when the selected city changes.
 */
const CitySelect: React.FC<Props> = ({ onChange }) => (
  <Select
    placeholder="Select city"
    onChange={onChange}
    variant="filled"
    bg="gray.200"
    color="gray.800"
    _focus={{ borderColor: "gray.300", boxShadow: "none" }}
  >
    {cities.map((city) => (
      <option key={city.name} value={city.name}>
        {city.name}
      </option>
    ))}
  </Select>
);

export default CitySelect;
