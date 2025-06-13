export type Item = {
  [key: string]: any;
  // id: string;
  // key?: number;
  // name: { en: string; ar: string }; // Supports multiple languages
  // barcode: string;
  // price: number;
  // quantity: number;
  // stock: number;
  // modifiers: any[]; // Consider defining a type for modifiers
  // category: { name: string; id: string }; // Matches combinedProduct structure
  // categoryId: string;
  // image: string;
  // vendorId: string;

  // handleStock?: string;
  // discountedPrice: number;
  // branchesIds: string;
  // images: Array<any>; // Define a type for images if needed
  // originalPrice: number;
  // productSpecialInstruction: string;
  // description: { en: string; ar: string }; // Supports multiple languages
  // tags: string[];
  // isStockManagement?: boolean;
  // assignedModifiers?: any[];
  // selectedModifiers?: any[];
  // stockQuantity: number;
  // activeDiscount?: any; // Define a type for discounts if possible
  // weight: number;
  // length: number;
  // height: number;
  // width: number;
  // sku: string | null;
  // stockHandle: string;
};

export type ModifierOption = {
  name: string;
  price: number;
  value?: string;
  quantity?: number;
  selected?: boolean;
  withQuantity?: boolean;
};

export type Indexable = Record<string, any>;

export type Modifier = {
  id: string;
  type: string;
  required: boolean;
  multiple: boolean;
  name: { en: string; ar: string };
  minSelection?: number;
  maxSelection?: number;
  list: ModifierOption[];
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
  image: string;
  role: string;
  permissions?: any;
};

export type Vendor = {
  id: string;
  logo: string;
  name: string;
  apiKey: string;
  domains: string[];
  defaultCurrency: string;
  payments: Indexable;
  users: any[];
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
