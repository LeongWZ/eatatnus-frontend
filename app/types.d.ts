export type Canteen = {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    locationId: number;
    location: Location;
    stalls: Stall[];
    outletReviews: OutletReview[];
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
    ownerId: null,
    canteenId: number;
}

export type OutletReview = {
    id: number;
    cleanliness: number;
    seatAvailability: number;
    reviewId: number;
    canteenId: number;
    review: Review;
}

export type Review = {
    id: number;
    rating: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    reviewType: string;
    userId: number;
    user: { name: string };
}