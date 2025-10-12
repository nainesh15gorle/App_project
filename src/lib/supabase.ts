import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Component {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  stock_quantity: number;
  min_stock_level: number;
  unit_price: number;
  location: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  component_id: string;
  transaction_type: 'checkout' | 'return';
  quantity: number;
  user_name: string;
  user_email: string;
  purpose: string | null;
  transaction_date: string;
  expected_return_date: string | null;
  actual_return_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  created_at: string;
}
