import { subtle } from "node:crypto";
import { Buffer } from 'node:buffer';

export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await subtle.digest('SHA-256', data);
    return Buffer.from(hashBuffer).toString('hex');
}