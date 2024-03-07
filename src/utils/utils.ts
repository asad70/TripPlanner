import { addDays } from "date-fns";

/**
 * Validates the selected date.
 *
 * @param {Date} selectedDate - The date selected by the user.
 * @returns {boolean} - Whether the date is valid or not.
 */
export const validateDate = (
  selectedDate: Date,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
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
