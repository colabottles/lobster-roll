export interface LobsterShack {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website?: string;
  price: number; // 1-5 scale, $ to $$$$$
  rating: number; // 0-5 scale
  reviewCount: number;
  tags: string[];
  hours: {
    [key: string]: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  photos: string[];
  isFavorite: boolean;
  distance?: number; // in miles from user, calculated dynamically
}