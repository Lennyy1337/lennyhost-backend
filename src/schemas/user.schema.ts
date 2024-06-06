import { createYupSchema } from 'fastify-yup-schema';

export const createUserSchema = createYupSchema((yup) => ({
    body: yup
        .object()
        .shape({
            username: yup.string().trim().min(2).max(32).required(),
            email: yup.string().email().trim().min(8).max(32).required(),
            password: yup.string().trim().min(6).max(64).required(),
        })
        .noUnknown(),
}));

export const signInUserSchema = createYupSchema((yup) => ({
    body: yup
        .object()
        .shape({
            email: yup.string().email().trim().min(8).max(32).required(),
            password: yup.string().trim().min(6).max(64).required(),
        })
        .noUnknown(),
}));
