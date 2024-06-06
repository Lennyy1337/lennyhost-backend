import argon2 from 'argon2';

const hash = async (plain: string): Promise<string> => {
    return await argon2.hash(plain);
};

const verify = async (hash: string, plain: string): Promise<boolean> => {
    return await argon2.verify(hash, plain);
};

export { hash, verify };
