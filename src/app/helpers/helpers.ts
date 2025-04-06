import { text } from "stream/consumers";

export function $calculateDiscountAmount(discount: number, originalPrice: number): number {
  if (discount < 0 || discount > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return parseFloat(((originalPrice * discount) / 100).toFixed(2));
}

export function $getPriceAfterDiscount(discount: number, originalPrice: number): number {
  const discountAmount = $calculateDiscountAmount(discount, originalPrice);
  return parseFloat((originalPrice - discountAmount).toFixed(2));
}

export function $getSingularOrPlural(text: string, quantity: number): string {
  if (quantity === 1) {
    const words = text.split(" ");
    const lastWord = words[words.length - 1];
    const singularLastWord = lastWord.endsWith("s") ? lastWord.slice(0, -1) : lastWord;
    words[words.length - 1] = singularLastWord;
    return words.join(" ");
  }
  return text;
}

export function $toTitleCase(text: any): string {
  if (!text || typeof text !== "string") return text;

  // Preprocess the string to handle camelCase, snake_case, kebab-case, etc.
  const processedText = text
    .replace(/([A-Z])/g, " $1") // Add space before capital letters (camelCase)
    .replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
    .trim(); // Remove leading/trailing spaces

  // Split into words, capitalize each word, and join back
  return processedText
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function $writeOnLocal(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function $getFromLocal(key: string): any {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function $getImgSrc(vendorId: string, imageName: String, xParams: string): any {
  return `https://static.menasa.io/${vendorId}/${imageName}?${xParams}&auto=compress`;
}
export function $translate(text: { en: string; ar: string }): string {
  return text.en || text.ar;
}

export function $generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function $getImgAlter(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");
}

export function $getColorFromString(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export function $loader(show: boolean) {
  const element = document.getElementById("my-loader");
  if (element) {
    if (!show) {
      element.classList.add("hidden"); // Add hidden class
    } else {
      element.classList.remove("hidden"); // Remove hidden class
    }
  }
}

export function $currency() {
  return $getFromLocal("vendor")?.defaultCurrency || "KD";
}

export function $deepEqual(obj1: any, obj2: any): boolean {
  // Primitive types and reference equality check
  if (obj1 === obj2) return true;

  // Handle null/undefined cases
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // Special case handling for Dates
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  // Special case handling for RegExp
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.source === obj2.source && obj1.flags === obj2.flags;
  }

  // Array comparison
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => $deepEqual(item, obj2[index]));
  }

  // Object comparison
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    // Check if key exists in both objects
    if (!obj2.hasOwnProperty(key)) return false;

    // Recursive deep comparison for nested properties
    return $deepEqual(obj1[key], obj2[key]);
  });
}

/**
 * Format a date using customizable patterns
 * @param date - Date object to format
 * @param format - Format string with tokens:
 * YYYY: 4-digit year
 * YY: 2-digit year
 * MMMM: Full month name
 * MMM: Short month name
 * MM: 2-digit month
 * M: Month number
 * DD: 2-digit day
 * D: Day number
 * dddd: Full weekday
 * ddd: Short weekday
 * HH: 24-hour format
 * hh: 12-hour format
 * mm: Minutes
 * ss: Seconds
 * A: AM/PM (uppercase)
 * a: am/pm (lowercase)
 * @returns Formatted date string
 */
export function $formatDate(date: Date, format: string): string {
  date = new Date(date);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const pad = (n: number) => n.toString().padStart(2, "0");
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return format.replace(/(YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|hh|mm|ss|A|a|Do)/g, (match) => {
    switch (match) {
      case "YYYY":
        return date.getFullYear().toString();
      case "YY":
        return date.getFullYear().toString().slice(-2);
      case "MMMM":
        return monthNames[date.getMonth()];
      case "MMM":
        return monthNames[date.getMonth()].slice(0, 3);
      case "MM":
        return pad(date.getMonth() + 1);
      case "M":
        return (date.getMonth() + 1).toString();
      case "DD":
        return pad(date.getDate());
      case "D":
        return date.getDate().toString();
      case "dddd":
        return dayNames[date.getDay()];
      case "ddd":
        return dayNames[date.getDay()].slice(0, 3);
      case "HH":
        return pad(date.getHours());
      case "hh":
        return pad(date.getHours() % 12 || 12);
      case "mm":
        return pad(date.getMinutes());
      case "ss":
        return pad(date.getSeconds());
      case "A":
        return date.getHours() >= 12 ? "PM" : "AM";
      case "a":
        return date.getHours() >= 12 ? "pm" : "am";
      case "Do":
        return getOrdinal(date.getDate());
      default:
        return match;
    }
  });
}

export function $getSeverity(status: any): string {
  if (typeof status !== "string") return "black";
  const stu = status.toLowerCase();

  if (["pending"].includes(stu)) return "warning";
  if (["preparing"].includes(stu)) return "secondary";
  if (["delivering"].includes(stu)) return "info";
  if (["completed"].includes(stu)) return "success";

  return "black";
}

export function $pluralToSingular(word: string, count: number): string {
  // Handle common pluralization rules and exceptions
  const irregularPlurals: { [key: string]: string } = {
    children: "child",
    "Statuses have": "Status has",
  };

  // Check for irregular plurals first
  if (irregularPlurals[word.toLowerCase()]) {
    return count === 1 ? irregularPlurals[word.toLowerCase()] : word;
  }

  // Handle common plural patterns
  const pluralPatterns = [
    { pattern: /(quiz)zes$/i, replace: "$1" },
    { pattern: /(matr)ices$/i, replace: "$1ix" },
    { pattern: /(vert|ind)ices$/i, replace: "$1ex" },
    { pattern: /(alias|status)es$/i, replace: "$1" },
    { pattern: /(ss)$/i, replace: "$1" }, // words ending with ss (e.g., dress)
    { pattern: /(s)es$/i, replace: "$1" },
    { pattern: /(z)zes$/i, replace: "$1" },
    { pattern: /([^aeiou])ies$/i, replace: "$1y" },
    { pattern: /(s)$/i, replace: "" }, // general case for words ending with s
  ];

  // Apply patterns
  for (const { pattern, replace } of pluralPatterns) {
    if (pattern.test(word)) {
      return count === 1 ? word.replace(pattern, replace) : word;
    }
  }

  // Return original word if no patterns matched
  return word;
}
