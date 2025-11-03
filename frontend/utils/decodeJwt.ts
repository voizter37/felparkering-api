export function sanitizeToken(raw: string | null | undefined): string | null {
    if (!raw) return null;
    let t = raw.toString().replace(/^['"]|['"]$/g, "");
    t = t.replace(/^Bearer\s+/i, "").trim();
    return /^[^.]+\.[^.]+\.[^.]+$/.test(t) ? t : null;
}

export function decodeJwt<T = any>(token: string): T | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const pad = "=".repeat((4 - (base64.length % 4)) % 4);
        base64 += pad;

        const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");

        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const jsonStr = new TextDecoder("utf-8").decode(bytes);

        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error("Invalid JWT", error);
        return null;
    }
}