/**
 * Function that Calculates the height of the bar based on the value
 */
export const useCalculateBarHeight = (value: number) => {
  if (value === 0) return 50;
  if (value > 0 && value <= 1) return 50;
  if (value > 1 && value <= 2) return 50;
  if (value > 2 && value <= 3) return 50;
  if (value > 3 && value <= 4) return 50;
  if (value > 4 && value <= 5) return 60;
  if (value > 5 && value <= 6) return 70;
  if (value > 6 && value <= 7) return 80;
  if (value > 7 && value <= 8) return 90;
  if (value > 8) return 100;
};
