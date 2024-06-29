export interface CanteenLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Canteen {
  id: number;
  name: string;
  location: CanteenLocation;
}

export interface RouteParams {
  canteen: Canteen;
}
