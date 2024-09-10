  // Capitalizes names before displayed
export default function Capitalize(str: any) {
if (typeof str !== "string") {
    return "";
    }
return str.charAt(0).toUpperCase() + str.slice(1);
}