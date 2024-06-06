import { APP_CONSTANTS } from '@/config/app.config';
import crypto from 'crypto';

class ID {
    private sequence: bigint = 0n;
    private lastTimestamp: bigint = -1n;

    public generateCUID(prefix: string, length: number): string {
        return `${prefix}_${crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length)}`;
    }

    public generateTimestamp(): bigint {
        return BigInt(Date.now()) - BigInt(APP_CONSTANTS.EPOCH);
    }

    public generateRandomSequence(): bigint {
        return (
            BigInt(crypto.randomBytes(2).readUInt16LE(0)) &
            APP_CONSTANTS.SEQUENCE_MASK
        );
    }

    public generateSnowflake(): string {
        let timestamp = this.generateTimestamp();

        if (timestamp === this.lastTimestamp) {
            this.sequence = (0n + 1n) & APP_CONSTANTS.SEQUENCE_MASK;
            if (this.sequence === 0n) {
                timestamp = this.generateTimestamp();
            }
        } else {
            this.sequence = this.generateRandomSequence();
        }

        const snowflake =
            (timestamp << 22n) |
            (APP_CONSTANTS.MACHINE_ID << 12n) |
            (this.sequence & APP_CONSTANTS.SEQUENCE_MASK);

        const snowflakeString = snowflake.toString().padStart(18, '0');

        this.lastTimestamp = timestamp;

        return snowflakeString;
    }

    public generateGUID(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    public generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    public generateBase64ID(length: number = 22): string {
        return crypto
            .randomBytes(Math.ceil((length * 3) / 4))
            .toString('base64')
            .slice(0, length);
    }
}

const id = new ID();

export { id };
