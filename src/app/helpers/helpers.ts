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
