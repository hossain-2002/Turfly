export interface Turf {
  id: string;
  name: string;
  location: string;
  sport: string;
  pricePerHour: number;
  description: string;
  images: string[];
  managerId: string;
  amenities: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SearchFilters {
  location: string;
  sport: string;
  date: string;
}
