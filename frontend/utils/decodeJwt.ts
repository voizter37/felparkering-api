
export function decodeJwt<T = any>(token: string) {
    try {
        const [, payload] = token.split(".");
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/"); // Converts base64Url to base64.
        const decoded = atob(base64);
        return JSON.parse(decoded);
    } catch (error) {
        console.error("Invalid JWT", error);
        return null;
    }
}