export interface Category {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}
