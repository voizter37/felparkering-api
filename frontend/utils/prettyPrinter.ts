import { Address } from "../types/report";

export function prettyAddress(address: Address): string {
    return `${address.street} ${address.houseNumbers?.[0] ?? ""}, ${address.city}`;
}