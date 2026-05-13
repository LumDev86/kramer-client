import { Banner, Category, CategoryWithProducts, PaginatedResponse, Product, ProductFilters } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const api = {
  categories: {
    getAll: (params: { search?: string; limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.search) qs.set('search', params.search);
      if (params.limit) qs.set('limit', String(params.limit));
      const q = qs.toString() ? `?${qs.toString()}` : '';
      return fetcher<PaginatedResponse<CategoryWithProducts>>(`/categories${q}`);
    },
    getById: (id: string) =>
      fetcher<CategoryWithProducts>(`/categories/${id}`),
  },
  products: {
    getAll: (filters: ProductFilters = {}) => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.categoryId) params.set('categoryId', filters.categoryId);
      if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      const qs = params.toString() ? `?${params.toString()}` : '';
      return fetcher<PaginatedResponse<Product>>(`/products${qs}`);
    },
    getById: (id: string) =>
      fetcher<Product>(`/products/${id}`),
  },
  banners: {
    getAll: () => fetcher<Banner[]>('/banners'),
  },
};
