import { customAlphabet } from "nanoid";

const ALIAS_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const ALIAS_LENGTH = 7;
const MAX_RETRIES = 5;

const generateAlias = customAlphabet(ALIAS_ALPHABET, ALIAS_LENGTH);

// reserved aliases
const RESERVED_ALIASES = new Set([
    "api",
    "_next",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "shorten",
    "links",
    "login",
    "signup",
    "logout",
    "about",
    "contact",
    "privacy",
    "terms",
    "abuse",
    "report",
    "dashboard",
    "settings",
    "profile",
    "admin",
    "help",
    "docs",
    "blog",
]);

const ALIAS_REGEX = /^[A-Za-z0-9_-]{3,32}$/;

export function isValidAliasFormat(alias) {
    return typeof alias === "string" && ALIAS_REGEX.test(alias);
}

export function isReservedAlias(alias) {
    if (typeof alias !== "string") return false;
    return RESERVED_ALIASES.has(alias.toLowerCase());
}

// generate a unique alias by trying random codes until one isn't taken.
export async function generateUniqueAlias(aliasExists) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const candidate = generateAlias();
        if (RESERVED_ALIASES.has(candidate.toLowerCase())) continue;
        if (!(await aliasExists(candidate))) {
            return candidate;
        }
    }
    throw new Error("Failed to generate a unique alias, please try again");
}
