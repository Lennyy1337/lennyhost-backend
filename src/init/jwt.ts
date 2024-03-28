import { jwtToken } from "../tools/jwtToken";

export const jwt = new jwtToken(process.env.JWT_SECRET as string)