import { db } from '../../db/connection.js';
import { users } from '../../db/schema.js';
import fs from 'fs/promises';
import type { Handler } from 'hono';

export const healthHandler: Handler = async (c) => {
    // Check DB connectivity
    let dbHealthy = false;
    try {
        await db.select().from(users).limit(1); // simple query
        dbHealthy = true;
    } catch (e) {
        dbHealthy = false;
    }

    const envVars = ['JWT_SECRET', 'DB_FILE_NAME'];
    const envHealthy = envVars.every((v) => !!process.env[v]);

    let fsHealthy = false;
    try {
        await fs.access('server/uploads');
        fsHealthy = true;
    } catch (e) {
        fsHealthy = false;
    }

    const healthy = dbHealthy && envHealthy && fsHealthy;
    return c.json({
        healthy,
        checks: {
            database: dbHealthy,
            env: envHealthy,
            fileSystem: fsHealthy,
        },
        timestamp: new Date().toISOString(),
    });
};
