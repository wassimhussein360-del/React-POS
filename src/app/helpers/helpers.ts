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
  if (!text && typeof text !== "string") return text;
  return text
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
