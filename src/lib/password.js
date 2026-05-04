/**
 * Password complexity rules. Used both client-side (form validation) and
 * server-side (registration / authorize).
 *
 *  - At least 8 characters
 *  - At least one letter
 *  - At least one digit
 */

export const PASSWORD_MIN_LENGTH = 8;

export function isPasswordStrong(password) {
    if (typeof password !== "string") return false;
    if (password.length < PASSWORD_MIN_LENGTH) return false;
    if (!/[A-Za-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    return true;
}

export const PASSWORD_RULE_MESSAGE =
    "Password must be at least 8 characters and include a letter and a number.";
