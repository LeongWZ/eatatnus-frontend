export type Canteen = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  locationId: number;
  location: Location;
  stalls: Stall[];
  reviews: Review[];
};

export type Location = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
};

export type Stall = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: null;
  canteenId: number;
  reviews: Review[];
};

export type Review = {
  id: number;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  reviewType: string;
  userId: number;
  user: { name: string };
  images: Image[];
  canteenId?: number;
  canteen?: Canteen;
  stallId?: number;
  stall?: Stall;
};

export type Image = {
  id: number;
  url: string;
  createAt: string;
};
