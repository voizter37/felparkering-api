import { Address } from "../types/report";

export function prettyAddress(address: Address): string {
    return `${address.street} ${address.houseNumbers?.[0] ?? ""}, ${address.city}`;
}

export function prettyDate(date: string): string {
    const now = new Date();
    const reportDate = new Date(date);

    const diff = now.getTime() - reportDate.getTime();

    if  (diff < 60000) {
        let time = Math.round(diff / 1000);
        return time === 1 ? time + " second ago" : time + " seconds ago";
    } else if (diff < 3600000) {
        let time = Math.round(diff / 60000);
        return time === 1 ? time + " minute ago" : time + " minutes ago";
    } else if (diff < 86400000) {
        let time = Math.round(diff / 3600000);
        return time === 1 ? time + " hour ago" : time + " hours ago";
    } else if (diff < 259200000) {
        let time = Math.round(diff / 86400000);
        return time === 1 ? time + " day ago" : time + " days ago";
    } else {
        return reportDate.toLocaleDateString();
    }
}

export function prettyDistance(distance: number) {
    if (distance < 1000) {
        return Math.round(distance) + " meter";
    } else if (distance < 100000) {
        return Math.round(distance / 100) / 10 + " km"
    } else {
        return Math.round(distance / 1000) / 100 + " miles"
    }
}

export function prettyDuration(duration: number) {
    if (duration < 60) {
        return Math.round(duration) + " seconds";
    } else if (duration < 3600) {
        return Math.round(duration / 6) / 10 + " min"
    } else {
        return Math.round(duration / 360) / 10 + " h"
    }
}