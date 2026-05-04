import { env } from "@/lib/env";

/**
 * Tiny logger used by API routes.
 *
 *  - dev:  forwards to console
 *  - test: noop
 *  - prod: forwards to console; if SENTRY_DSN is set, the entry can later be
 *          forwarded to Sentry by swapping this module's implementation.
 *          (We deliberately don't pull in @sentry/nextjs yet.)
 */

const isTest = process.env.NODE_ENV === "test";

function format(level, message, context) {
    const payload = {
        level,
        ts: new Date().toISOString(),
        message: message instanceof Error ? message.message : String(message),
        ...(context ? { context } : {}),
    };
    if (message instanceof Error && message.stack) {
        payload.stack = message.stack;
    }
    return payload;
}

function emit(level, message, context) {
    if (isTest) return;
    const entry = format(level, message, context);
    if (level === "error") {
        console.error(JSON.stringify(entry));
    } else if (level === "warn") {
        console.warn(JSON.stringify(entry));
    } else {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(entry));
    }
}

export const logger = {
    info(message, context) {
        emit("info", message, context);
    },
    warn(message, context) {
        emit("warn", message, context);
    },
    error(message, context) {
        emit("error", message, context);
    },
};

export const sentryEnabled = Boolean(env.SENTRY_DSN);
