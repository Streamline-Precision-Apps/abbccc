export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Converts 0 to 12 for midnight and 13-23 to 1-11 for PM times
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const period = isPM ? 'PM' : 'AM';

    return `${formattedHours}:${formattedMinutes} ${period}`;
};