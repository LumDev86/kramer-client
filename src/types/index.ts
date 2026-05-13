export interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithProducts extends Category {
  products: { id: string; title: string }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  quantity: number | null;
  unit: string | null;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreScheduleDay {
  dayOfWeek: number;
  isOpen: boolean;
  openHour: number;
  closeHour: number;
}

export interface StoreConfig {
  status: 'open' | 'busy' | 'closed';
  busyTime: number | null;
  schedule: StoreScheduleDay[];
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  title: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
