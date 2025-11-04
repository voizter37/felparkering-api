import type { ParkingViolationValue } from "../constants/parkingCategories";

export interface Report {
    attendantGroup: any;
    longitude: number;
    latitude: number;
    createdOn: string;
    category: string;
    address: Address;
    violation: ParkingViolationValue;
    licensePlate: string;
    timeStamp: string;
    coords: [number, number];
}

export interface Address {
    id: number,
    distanceFromCity: number,
    latitude: number,
    longitude: number,
    street: string;
    houseNumbers: string[];
    city: string;
}