export type Seller = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  year: number;
  genre: string;
  createdAt: string;
  seller: Seller;
  images: Image[];
  trackList: Track[];
  reviews: Review[];
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
};

export type Image = {
  id?: number;
  url: string;
};

export type Track = {
  id?: number;
  title: string;
  duration: string;
};
