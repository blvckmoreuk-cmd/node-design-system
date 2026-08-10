export interface ProductMetaRow {
  label: string;
  value: string;
}

export interface Product {
  num: string;
  title: string;
  tagline: string;
  detail: string;
  price: string;
  note?: string;
  hex: string;
  image?: string;
  preview?: string;
  features: string[];
  meta: ProductMetaRow[];
}
