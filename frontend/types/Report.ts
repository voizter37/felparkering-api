export interface Report {
    createdOn: string;
    category: string;
    location: string;
    address: string;
    violation: string;
    licensePlate: string;
    timeStamp: string;
    coords: [number, number];
}