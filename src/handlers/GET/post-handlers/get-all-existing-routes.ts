import type { Handler } from "hono/types";
import { db } from "../../../db/connection.js";
import { posts } from "../../../db/schema.js";

export const getAllExistingRoutesHandler: Handler = async (c) => {
    const allroutes = await db.select({ routes: posts.route }).from(posts).limit(1000);

    const routes = allroutes.map((route) => route.routes);
    if (routes.length === 0) {
        throw new Error("No routes found in the database");
    }

    const uniqueRoutes = [...new Set(routes)];


    return c.json({
        message: "All existing routes fetched successfully",
        routes: uniqueRoutes,
        totalRoutes: uniqueRoutes.length,
    }, 200);
}