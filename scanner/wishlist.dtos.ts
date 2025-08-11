import { Role } from '../core/enums/roles.enum';

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProductDTO {
  name: string;
  price: number;
  desc?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistDTO {
  id: string;
  product: ProductDTO | string;
  user?: UserDTO | string;
}

export interface ScannerDTO {
  id: string;
  qrCode: string;
  barCode: string;
}

export interface ScannerQueryDTO {
  readonly tags?: string | string[];
  readonly tag?: string;
  id?: string;
  qrCode?: string;
  sortBy?: 'id';
  orderBy?: 'DESC' | 'ASC';
  limit?: number;
  offset?: number;
}

export interface WishlistQueryDTO {
  id?: string;
  productId?: string;
  userId?: string;
  sortBy?: 'productId' | 'userId';
  orderBy?: 'DESC' | 'ASC';
  limit?: number;
  offset?: number;
}

export interface UserAuth {
  id: string;
  role: Role;
}

export interface CodeDTO {
  readonly valst?: string;
  readonly valmod?: string;
}

export interface MailOptionsDTO {
  to: string;
  subject: string;
  html: string;
}
