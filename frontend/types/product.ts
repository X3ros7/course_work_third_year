export interface Track {
  title: string;
  number: string;
  duration: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  genre: string;
  artist: string;
  year: number;
  trackList: Track[];
  isActive: boolean;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
}
