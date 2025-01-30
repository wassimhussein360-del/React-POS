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
