export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  user?: {
    id: number;
    first_name: string;
    username?: string;
    last_name?: string;
    auth_date?: string;
    hash?: string;
  } | null;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}