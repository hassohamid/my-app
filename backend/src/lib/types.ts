export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  availability: boolean;
  user_id: string;
  image_url: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface PropertyInput {
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  availability?: boolean;
  image_url?: string;
}

export interface BookingInput {
  check_in_date: string;
  check_out_date: string;
  property_id: string;
}
