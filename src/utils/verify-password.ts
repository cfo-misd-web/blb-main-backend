import { subtle } from "node:crypto";
import { Buffer } from "node:buffer";

export async function verifyPassword(storedHash: string, providedPassword: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(providedPassword);
    const hashBuffer = await subtle.digest('SHA-256', data);
    const providedHash = Buffer.from(hashBuffer).toString('hex');
    return storedHash === providedHash;
}