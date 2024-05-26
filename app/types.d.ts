export type Canteen = {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    locationId: number;
    location: Location;
};

export type Location = {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
};