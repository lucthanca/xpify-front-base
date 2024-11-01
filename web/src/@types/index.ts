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

export type GraphQlCollectionQueryResponse<T = any> = {
  [key: string]: CollectionQueryData<T>
} | undefined;

export type GraphQlQueryResponse<T = any> = {
  [key: string]: T
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
  local: boolean;
}

export type HomeBlock = {
  id: 'home_welcome_message' | 'home_contact_us' | 'home_guide_step';
  dismissed: boolean;
}
export type InstalledSection = {
  id: string;
  section_id: string;
  theme_id: string;
  version: string;
  created_at: string;
  updated_at: string;
  section: Section;
  theme: ShopifyTheme;
}
export type Shop = {
  domain: string;
  email: string;
  name: string;
  shop_owner: string;
  home_blocks: HomeBlock[];
  installed_sections: CollectionQueryData<InstalledSection>,
  available_sections_count: number;
  installed_sections_count: number;
}

export interface UserContextType {
  shop: Shop | undefined;
  loading: boolean;
}

export interface AppRecommend {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  url: string;
}

export interface RefBlockSlide {
  id: string;
  title: string;
  description: string;
  image_url: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  sort: number;
  status: "ENABLED" | "DISABLED";
}
