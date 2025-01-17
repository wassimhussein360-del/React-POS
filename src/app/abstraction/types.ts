export type Discount = {
  unit: "kwd" | "%";
  value: number;
};

export type Item = {
  id: string;
  key?: number;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
  stock: number;
  discount?: Discount;
  modifiers: any[];
  category: string;
  image: string;
};

export type ModifierOption = {
  name: string;
  price: number;
  value?: string;
  isSelected?: boolean;
};

export type Modifier = {
  type: string;
  required: boolean;
  multiple: boolean;
  name: string;
  min?: number;
  max?: number;
  options: ModifierOption[];
};
