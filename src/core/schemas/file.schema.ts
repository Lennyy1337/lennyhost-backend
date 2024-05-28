import { z } from 'zod';

const FileSchema = z.object({
    id: z.string().cuid(),
    hash: z.string(),
    name: z.string(),
    size: z.number().int(),
    mime_type: z.string(),
    path: z.string(),
    protected: z.boolean().default(false),
    encrypted: z.boolean().default(false),
    created_at: z.date().default(() => new Date()),
    updated_at: z
        .date()
        .optional()
        .transform((val) => val || new Date()),
    user_id: z.string(),
});

export type File = z.infer<typeof FileSchema>;
