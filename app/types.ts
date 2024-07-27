export type Profile = {
  id: number;
  bio: string;
  userId: number;
  image: Image | null;
};

export enum Role {
  Admin = "ADMIN",
  User = "User",
  Business = "BUSINESS",
}

export type User = {
  id: number;
  firebaseId: number;
  name: string;
  createdAt: string;
  role: Role;
  profile: Profile | null;
  reviews?: Review[];
};

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
  ownerId: number | null;
  canteenId: number;
  reviews: Review[];
  menu: Menu | null;
};

export type Review = {
  id: number;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  reviewType: string;
  userId: number | null;
  user: User | null;
  images: Image[];
  canteenId?: number;
  canteen?: Canteen;
  stallId?: number;
  stall?: Stall;
};

export type Image = {
  id: number;
  url?: string;
  createAt: string;
};

export type Food = {
  id: number;
  name: string;
  calories?: number | null;
  cholesterol?: number | null;
  dietaryFiber?: number | null;
  potassium?: number | null;
  protein?: number | null;
  saturatedFat?: number | null;
  servingQty?: number | null;
  servingUnit?: string | null;
  servingWeightGrams?: number | null;
  sodium?: number | null;
  sugars?: number | null;
  totalCarbohydrate?: number | null;
  totalFat?: number | null;
};

export type Menu = {
  id: number;
  items: Food[];
  stallId: number;
};

export type CaloricTracker = {
  id: number;
  caloricTrackerEntries: CaloricTrackerEntry[];
  userId: number;
};

export type CaloricTrackerEntry = {
  id: number;
  createdAt: string;
  updatedAt: string;
  foods: FoodsOnCaloricTrackerEntries[];
  caloricTrackerId: number;
};

export type FoodsOnCaloricTrackerEntries = {
  count: number;
  food: Food;
  foodId: number;
  caloricTrackerEntryId: number;
};
