export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const isPM = hours >= 12;
    const formattedHours = isPM ? hours - 12 : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const period = isPM ? 'PM' : 'AM';

    return `${formattedHours === 0 ? 12 : formattedHours}:${formattedMinutes} ${period}`;
};