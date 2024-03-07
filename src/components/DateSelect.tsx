import { Input } from "@chakra-ui/react";
import { addDays, format } from "date-fns";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A date input component to allow the user to select a date.
 *
 * @param {function} onChange - The function to call when the selected date changes.
 */
const DateSelect: React.FC<Props> = ({ onChange }) => (
  <Input
    type="date"
    onChange={onChange}
    min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
    max={format(addDays(new Date(), 5), "yyyy-MM-dd")}
    bg="gray.200"
    color="gray.800"
    _focus={{ borderColor: "gray.300", boxShadow: "none" }}
    _hover={{ bg: "gray.200" }}
  />
);

export default DateSelect;
