import mongoose from "mongoose";
import { env } from "@/lib/env";

/**
 * Cache the mongoose connection on `globalThis` so hot-reload in dev and
 * concurrent requests on a cold serverless lambda do not open multiple
 * connections.
 *
 * Pattern adapted from
 * https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose
 */

const MONGODB_URI = env.MONGODB_URI;

let cached = globalThis._mongooseCache;
if (!cached) {
    cached = globalThis._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not set");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
            })
            .then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the promise so the next request can retry instead of
        // permanently caching a rejected connection.
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default dbConnect;
