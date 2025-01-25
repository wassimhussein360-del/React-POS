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
  categoryId: string;
  image: string;
  vendorId: string;
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

export type Category = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  products: Item[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: string;
};

export type Vendor = {
  id: string;
  logo: string;
  name: string;
  apiKey: string;
};

export type customer = {
  id: string;
  name: string;
};

export type AnalyticsVariables = {
  limit?: number;
  page?: number;
  sortBy?: string[];
  query?: any;
  filter?: any;
  interval?: string;
};
