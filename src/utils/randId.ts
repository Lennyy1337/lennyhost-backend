import crypto from 'crypto';

function randId(prefix: string, length: number): string {
    return `${prefix}_${crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)}`;
}

export { randId };
