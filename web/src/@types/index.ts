export type Interval = {
  interval: string;
  amount: number;
}
export type SectionImage = {
  src: string;
  alt: string;
}
export interface PricingPlan {
  id: string;
  status: boolean;
  code: string;
  name: string;
  prices: Interval[];
  currency: string;
  description: string;
  sort_order: number;
}
export type PageInfo = {
  total_pages: number;
  current_page: number;
  page_size: number;
}
export type CollectionQueryData<T = any> = {
  items: T[] | null;
  page_info: PageInfo;
};

export type GraphQlQueryResponse<T = any> = {
  [key: string]: CollectionQueryData<T>
} | undefined;

type Category = {
  id: string;
  name: string;
  sections: CollectionQueryData<Section>;
}
export interface SectionInterface {
  __typename: string;
  id: string;
  entity_id: string;
  name: string;
  description: string;
  price: number;
  version: string;
  is_enable: boolean;
  plan_id: string;
  status: string;
  images: SectionImage[];
  url_key: string;
  categories: string[] | null;
  categoriesV2: Category[] | null;
  tags: string[] | null;
  installed: Install[];
  type_id: string;
}
export type SectionActions = {
  install: boolean;
  purchase: boolean;
  plan: boolean;
};
export type Install = {
  theme_id: string;
  product_version: string
};
export type SimpleSection = SectionInterface & {
  actions: SectionActions;
  pricing_plan: PricingPlan | null;
  version: String;
  release_note: String;
  src: String
};
export type GroupSection = SectionInterface & {
  child_ids: string[];
}
export type Section = SimpleSection | GroupSection;

export type ComplexCollectionQueryResponse<T = any> = {
  [key: string]: CollectionQueryData<T> | T[];
};
export type CollectionQueryResponse<T = any> = {
  [key: string]: CollectionQueryData<T>;
};

export type ShopifyTheme = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  role: 'main' | 'unpublished' | 'demo' | 'development';
  theme_store_id?: string;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
  errors?: string;
}

export type HomeBlock = {
  id: string;
  dismissed: boolean;
}

export type Shop = {
  domain: string;
  email: string;
  name: string;
  shop_owner: string;
  home_blocks: HomeBlock[];
}

export interface UserContextType {
  shop: Shop | undefined;
  loading: boolean;
}
