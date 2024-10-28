export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const isPM = hours >= 12;
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  const period = isPM ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
};
