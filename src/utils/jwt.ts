import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_CONFIG } from '../config/app.config';

const generateJwtToken = (
    payload: object,
    expiresIn: string,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: expiresIn,
                issuer: APP_CONFIG.JWT_ISSUER,
            },
            (error, token: any) => {
                if (error) {
                    reject(new Error('Error generating JWT token'));
                } else {
                    resolve(token);
                }
            },
        );
    });
};

const verifyJwtToken = async (token: string): Promise<string | JwtPayload> => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
        issuer: APP_CONFIG.JWT_ISSUER,
    });
};

export { generateJwtToken, verifyJwtToken };
