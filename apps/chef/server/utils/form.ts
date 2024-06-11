import { z } from 'zod';

/**
 * Validates a given form data for correct email address.
 */
export function validateEmailData(data: FormDataEntryValue | null) {
    const emailSchema = z.string().email();
    const { data: email, success: validEmail } = emailSchema.safeParse(data);
    if (!validEmail) {
        throw createError({
            message: 'Invalid email',
            statusCode: 400,
        });
    }
    return email;
}

/**
 * Validates a given form data for correct password.
 */
export function validatePasswordData(data: FormDataEntryValue | null) {
    const passwordSchema = z.string().min(6).max(255);
    const { data: password, success: validPassword } = passwordSchema.safeParse(data);
    if (!validPassword) {
        throw createError({
            message: 'Invalid password',
            statusCode: 400,
        });
    }
    return password;
}
